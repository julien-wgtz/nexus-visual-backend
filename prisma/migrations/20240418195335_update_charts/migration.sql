/*
  Warnings:

  - You are about to drop the column `accountId` on the `charts` table. All the data in the column will be lost.
  - Made the column `folderId` on table `charts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `accountId` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "charts" DROP CONSTRAINT "charts_accountId_fkey";

-- DropForeignKey
ALTER TABLE "charts" DROP CONSTRAINT "charts_folderId_fkey";

-- AlterTable
ALTER TABLE "charts" DROP COLUMN "accountId",
ALTER COLUMN "folderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "accountId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charts" ADD CONSTRAINT "charts_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
