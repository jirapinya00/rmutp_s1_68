/*
  Warnings:

  - You are about to alter the column `password` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(72)`.

*/
-- DropIndex
DROP INDEX "public"."Profile_cardId_key";

-- DropIndex
DROP INDEX "public"."Profile_mobile_key";

-- AlterTable
ALTER TABLE "public"."Profile" ALTER COLUMN "password" SET DATA TYPE VARCHAR(72),
ALTER COLUMN "cardId" SET DATA TYPE VARCHAR(72),
ALTER COLUMN "mobile" SET DATA TYPE VARCHAR(72);
