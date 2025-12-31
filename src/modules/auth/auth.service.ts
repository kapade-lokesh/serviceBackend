// check the credentials of user and assign tokens
import jwt from "jsonwebtoken";
import { AuthenticationError, NotFoundError } from "../../utils/ApiError";
import { isCorrectPassword } from "../../utils/encryption";
import { createUser, findUserByEmail, updateUser } from "../user/user.service";
import { Iauth } from "./auth.schema";
import { prisma } from "../../lib/prisma";
import { verifyAccessToken } from "../../utils/jwt";
import { Auth, Role } from "../../generated/prisma/enums";

const loginUser = async (credentials: Iauth) => {
  const { email, password } = credentials;
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new NotFoundError("User");
  }

  if (!existingUser.password) {
    throw new AuthenticationError(
      "This Account Uses Google Sign-In Please Login With Google "
    );
  }

  const iscorrect = isCorrectPassword(
    password,
    existingUser.password as string
  );

  if (!iscorrect) {
    throw new AuthenticationError("Invalid Password");
  }

  const accesstoken = jwt.sign(
    { id: existingUser.id, email: existingUser.email, role: existingUser.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: Math.floor(
        Number(process.env.JWT_ACCESS_TOKEN_EXPIRY_MS) / 1000
      ),
    }
  );
  const refreshtoken = jwt.sign(
    { id: existingUser.id, email: existingUser.email, role: existingUser.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: Math.floor(
        Number(process.env.JWT_REFRESH_TOKEN_EXPIRY_MS) / 1000
      ),
    }
  );

  const absoluteExpiry = new Date(
    Date.now() + Number(process.env.JWT_REFRESH_TOKEN_EXPIRY_MS)
  );

  await prisma.token.create({
    data: {
      userId: existingUser.id,
      token: refreshtoken,
      expiresAt: absoluteExpiry,
    },
  });

  return { accesstoken, refreshtoken };
};

const generateAccessToken = async (refreshtoken: string) => {
  if (!refreshtoken) {
    throw new AuthenticationError("Token Not Found");
  }

  const decoded = verifyAccessToken(refreshtoken);

  const storedToken = await prisma.token.findUnique({
    where: { token: refreshtoken },
  });

  if (!storedToken) {
    throw new AuthenticationError("Token Not Found");
  }

  if (storedToken.expiresAt < new Date()) {
    throw new AuthenticationError("Session expired");
  }

  const now = Date.now(); // current time in ms
  const expiresAt = storedToken.expiresAt.getTime(); // Date → ms
  const remainingTimeInSeconds = Math.floor((expiresAt - now) / 1000);

  if (remainingTimeInSeconds <= 0) {
    throw new AuthenticationError("Session expired");
  }

  const newAccessToken = jwt.sign(
    {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: Math.floor(
        Number(process.env.JWT_ACCESS_TOKEN_EXPIRY_MS) / 1000
      ),
    }
  );

  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: remainingTimeInSeconds }
  );

  await prisma.token.update({
    where: { id: storedToken.id },
    data: { token: newRefreshToken },
  });

  return { newAccessToken, newRefreshToken };
};

const handleGoogleLogin = async (googleUser: {
  email: string;
  googleId: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  password?: string;
}) => {
  let user = await findUserByEmail(googleUser.email);

  if (user) {
    if (user.authProvider === Auth.GOOGLE) {
      // nothing to update
    }

    if (user.authProvider === Auth.LOCAL) {
      user = await updateUser({
        id: user.id,
        data: {
          authProvider: Auth.GOOGLE,
          authProviderId: googleUser.googleId,
        },
      });
    }
  }

  if (!user) {
    user = await createUser({
      email: googleUser.email,
      firstname: googleUser.firstName || "",
      lastname: googleUser.lastName || "",
      mobile: "",
      address: "",
      role: Role.CUSTOMER,
      password: googleUser.password || null, // IMPORTANT
      authProvider: Auth.GOOGLE, // IMPORTANT
      authProviderId: googleUser.googleId,
    });
  }

  if (!user) {
    throw new Error("Failed To Create Or Retrieve User");
  }

  const accesstoken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: Math.floor(
        Number(process.env.JWT_ACCESS_TOKEN_EXPIRY_MS) / 1000
      ),
    }
  );
  const refreshtoken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: Math.floor(
        Number(process.env.JWT_REFRESH_TOKEN_EXPIRY_MS) / 1000
      ),
    }
  );

  const absoluteExpiry = new Date(
    Date.now() + Number(process.env.JWT_REFRESH_TOKEN_EXPIRY_MS)
  );

  await prisma.token.create({
    data: {
      userId: user.id,
      token: refreshtoken,
      expiresAt: absoluteExpiry,
    },
  });

  return { accesstoken, refreshtoken };
};

export { loginUser, generateAccessToken, handleGoogleLogin };
