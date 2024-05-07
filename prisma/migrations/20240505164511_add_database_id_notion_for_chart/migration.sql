/*
  Warnings:

  - Added the required column `databaseId` to the `charts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "charts" ADD COLUMN     "databaseId" TEXT NOT NULL;
