/*
  Warnings:

  - You are about to alter the column `password` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(60)`.
  - You are about to alter the column `cardId` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(60)`.
  - You are about to alter the column `mobile` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(60)`.

*/
-- AlterTable
ALTER TABLE "public"."Profile" ALTER COLUMN "password" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "cardId" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "mobile" SET DATA TYPE VARCHAR(60);
