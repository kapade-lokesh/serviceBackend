import { prisma } from "../../lib/prisma";
import { Role } from "../../generated/prisma/enums";
import { Iuser } from "./user.schema";
import { UseralreadyExist } from "../../utils/ApiError";
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
    user.password = null;

    return user;
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
