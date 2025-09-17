/*
  Warnings:

  - You are about to alter the column `cardId` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `mobile` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[cardId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cardIdIv` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileIv` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordIv` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "cardIdIv" VARCHAR(32) NOT NULL,
ADD COLUMN     "mobileIv" VARCHAR(32) NOT NULL,
ADD COLUMN     "passwordIv" VARCHAR(32) NOT NULL,
ALTER COLUMN "cardId" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "mobile" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "status" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_cardId_key" ON "public"."Profile"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_mobile_key" ON "public"."Profile"("mobile");
