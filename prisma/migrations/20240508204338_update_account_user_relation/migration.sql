/*
  Warnings:

  - You are about to drop the column `ownerId` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ROLE_ACCOUNT" ADD VALUE 'OWNER';

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_ownerId_fkey";

-- DropIndex
DROP INDEX "accounts_ownerId_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "ownerId";
