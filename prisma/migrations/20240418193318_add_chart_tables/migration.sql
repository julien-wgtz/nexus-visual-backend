-- CreateEnum
CREATE TYPE "CHART_TYPE" AS ENUM ('LINE', 'BAR', 'PIE', 'DOUGHNUT');

-- CreateTable
CREATE TABLE "folders" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "currentChartType" "CHART_TYPE" NOT NULL DEFAULT 'LINE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "accountId" INTEGER NOT NULL,
    "folderId" INTEGER,

    CONSTRAINT "charts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chart_data" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "chartType" "CHART_TYPE" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "chartId" INTEGER NOT NULL,

    CONSTRAINT "chart_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "charts" ADD CONSTRAINT "charts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charts" ADD CONSTRAINT "charts_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_data" ADD CONSTRAINT "chart_data_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "charts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
