/*
  Warnings:

  - The values [DOUGHNUT] on the enum `CHART_TYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CHART_TYPE_new" AS ENUM ('LINE', 'BAR', 'PIE');
ALTER TABLE "charts" ALTER COLUMN "currentChartType" DROP DEFAULT;
ALTER TABLE "charts" ALTER COLUMN "currentChartType" TYPE "CHART_TYPE_new" USING ("currentChartType"::text::"CHART_TYPE_new");
ALTER TYPE "CHART_TYPE" RENAME TO "CHART_TYPE_old";
ALTER TYPE "CHART_TYPE_new" RENAME TO "CHART_TYPE";
DROP TYPE "CHART_TYPE_old";
ALTER TABLE "charts" ALTER COLUMN "currentChartType" SET DEFAULT 'LINE';
COMMIT;

-- AlterTable
ALTER TABLE "charts" ADD COLUMN     "shareToken" TEXT;
