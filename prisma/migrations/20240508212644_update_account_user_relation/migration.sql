/*
  Warnings:

  - Added the required column `currentAccountId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currentAccountId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_currentAccountId_fkey" FOREIGN KEY ("currentAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
