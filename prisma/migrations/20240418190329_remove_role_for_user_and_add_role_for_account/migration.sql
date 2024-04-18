/*
  Warnings:

  - The values [TESTEUR,BASIC,PRENIUM] on the enum `STATUS_ACCOUNT` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "STATUS_ACCOUNT_new" AS ENUM ('GOD', 'TESTER', 'PRO', 'FREE');
ALTER TABLE "accounts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "accounts" ALTER COLUMN "status" TYPE "STATUS_ACCOUNT_new" USING ("status"::text::"STATUS_ACCOUNT_new");
ALTER TYPE "STATUS_ACCOUNT" RENAME TO "STATUS_ACCOUNT_old";
ALTER TYPE "STATUS_ACCOUNT_new" RENAME TO "STATUS_ACCOUNT";
DROP TYPE "STATUS_ACCOUNT_old";
ALTER TABLE "accounts" ALTER COLUMN "status" SET DEFAULT 'FREE';
COMMIT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";

-- DropEnum
DROP TYPE "ROLE_USER";
