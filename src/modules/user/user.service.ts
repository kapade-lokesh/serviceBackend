import { prisma } from "../../lib/prisma";
import { Role } from "../../generated/prisma/enums";
import { Iuser } from "./user.schema";
import { UseralreadyExist, UserNotUpdatedError } from "../../utils/ApiError";
import { hashedPassword } from "../../utils/encryption";

//Find User By Email
const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user;
};

//Find User By Mobile
const findUserByMobile = async (mobile: string) => {
  const user = await prisma.user.findUnique({
    where: { mobile: mobile },
  });
  return user;
};

//Find User By Id
const findUserByID = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  return user;
};

//Create User Service
const createUser = async (data: Iuser) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new UseralreadyExist();
  }
  return prisma.$transaction(async (tx) => {
    let hash: string | null = null;

    // ONLY hash if password exists (LOCAL auth)
    if (data.password) {
      hash = await hashedPassword(data.password);
    }

    const { password, ...userData } = data;

    const user = await tx.user.create({
      data: { password: hash, ...userData },
    });

    if (user.role === Role.PROVIDER) {
      await tx.provider.create({
        data: {
          userID: user.id,
          location: "NOT_SET",
          availability: false,
          verified: false,
        },
      });
    }

    return user;
  });
};

//Update User Service
const updateUser = async (user: { id: string; data: {} }) => {
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { ...user.data },
  });
  if (!updateUser) {
    throw new UserNotUpdatedError();
  }

  return updatedUser;
};

//User Profile Service
const getProfile = async (user: { id: string }) => {
  const userId = user.id;

  const userProfile = await findUserByID(userId);

  if (!userProfile) {
    throw new Error("Unable To Get User Profile");
  }

  return userProfile;
};
export {
  createUser,
  findUserByMobile,
  findUserByEmail,
  updateUser,
  getProfile,
};
