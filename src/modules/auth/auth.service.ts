// check the credentials of user and assign tokens
import jwt from "jsonwebtoken";
import { AuthenticationError, NotFoundError } from "../../utils/ApiError";
import { isCorrectPassword } from "../../utils/encryption";
import { findUserByEmail, updateUser } from "../user/user.service";
import { Iauth } from "./auth.schema";

const loginUser = async (credentials: Iauth) => {
  const { email, password } = credentials;
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new NotFoundError("User");
  }

  const iscorrect = isCorrectPassword(password, existingUser.password);

  if (!iscorrect) {
    throw new AuthenticationError("Invalid Password");
  }

  const accesstoken = jwt.sign(
    { id: existingUser.id, email: existingUser.email, role: existingUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY }
  );
  const refreshtoken = jwt.sign(
    { id: existingUser.id, email: existingUser.email, role: existingUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY }
  );

  await updateUser({
    id: existingUser.id,
    data: { token: existingUser.token },
  });

  return { accesstoken, refreshtoken };
};

export { loginUser };
