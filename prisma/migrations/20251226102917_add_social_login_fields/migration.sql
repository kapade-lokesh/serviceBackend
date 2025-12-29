-- CreateEnum
CREATE TYPE "Auth" AS ENUM ('GOOGLE', 'LOCAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" "Auth" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "authProviderId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
