import { prisma } from "../../lib/prisma";
import { Role } from "@prisma/client";
import { Iuser } from "./user.schema";
import { NotFoundError, UseralreadyExist } from "../../utils/ApiError";
import { hashedPassword } from "../../utils/encryption";

//find user by email
const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user;
};

//find user by mobile
const findUserByMobile = async (mobile: string) => {
  const user = await prisma.user.findUnique({
    where: { mobile: mobile },
  });
  return user;
};

//create user service
const createUser = async (data: Iuser) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new UseralreadyExist();
  }
  return prisma.$transaction(async (tx) => {
    const hash: string = await hashedPassword(data.password);
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

    const { password: _, ...safeUser } = user;
    return safeUser;
  });
};

//update user

const updateUser = async (user: { id: string; data: {} }) => {
  const updateduser = prisma.user.update({
    where: { id: user.id },
    data: { ...user.data },
  });
  return updateduser;
};

export { createUser, findUserByMobile, findUserByEmail, updateUser };
