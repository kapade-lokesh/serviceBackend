import { prisma } from "../../lib/prisma";
import { Role } from "@prisma/client";
import { Iuser } from "./user.schema";
import { UseralreadyExist } from "../../utils/ApiError";

//create user service
export async function createUser(data: Iuser) {
  const existingUser = await prisma.user.findUnique({
    where: { mobile: data.mobile },
  });

  if (existingUser) {
    throw new UseralreadyExist();
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data });

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
}
