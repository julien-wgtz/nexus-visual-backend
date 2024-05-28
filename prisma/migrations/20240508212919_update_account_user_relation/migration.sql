-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_currentAccountId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "currentAccountId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_currentAccountId_fkey" FOREIGN KEY ("currentAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
