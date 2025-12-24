// import prisma from "./lib/prismaClient";
import { prisma } from "./lib/prisma";
export async function test() {
  await prisma.$connect();
  console.log("✅ Prisma connected successfully");
}
