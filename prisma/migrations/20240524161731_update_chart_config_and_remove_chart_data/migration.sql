/*
  Warnings:

  - You are about to drop the `chart_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chart_data" DROP CONSTRAINT "chart_data_chartId_fkey";

-- AlterTable
ALTER TABLE "charts" ADD COLUMN     "config" JSONB;

-- DropTable
DROP TABLE "chart_data";
