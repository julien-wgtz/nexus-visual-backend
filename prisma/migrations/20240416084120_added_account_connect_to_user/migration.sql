/*
  Warnings:

  - You are about to drop the column `notionMainPageId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `notionToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `upadte_at` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `update_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ROLE_USER" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ROLE_ACCOUNT" AS ENUM ('ADMIN', 'VIEWER');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "notionMainPageId",
DROP COLUMN "notionToken",
DROP COLUMN "upadte_at",
ADD COLUMN     "update_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "ROLE_USER" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "ROLE";

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "notionToken" TEXT NOT NULL,
    "notionPageId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_users" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "ROLE_ACCOUNT" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "account_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_ownerId_key" ON "accounts"("ownerId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_users" ADD CONSTRAINT "account_users_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_users" ADD CONSTRAINT "account_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
