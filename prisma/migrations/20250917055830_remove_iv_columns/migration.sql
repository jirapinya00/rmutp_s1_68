/*
  Warnings:

  - You are about to drop the column `cardIdIv` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `mobileIv` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `passwordIv` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "cardIdIv",
DROP COLUMN "mobileIv",
DROP COLUMN "passwordIv";
