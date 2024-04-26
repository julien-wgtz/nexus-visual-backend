/*
  Warnings:

  - Added the required column `order` to the `charts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "charts" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "order" INTEGER NOT NULL;
