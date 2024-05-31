-- AlterTable
ALTER TABLE "users" ADD COLUMN     "featureFlags" JSONB,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'light';
