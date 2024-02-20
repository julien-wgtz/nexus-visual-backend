/*
  Warnings:

  - You are about to drop the `confirmationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "confirmationToken" DROP CONSTRAINT "confirmationToken_userId_fkey";

-- DropTable
DROP TABLE "confirmationToken";

-- CreateTable
CREATE TABLE "confirmation_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "confirmation_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "confirmation_tokens_token_key" ON "confirmation_tokens"("token");

-- AddForeignKey
ALTER TABLE "confirmation_tokens" ADD CONSTRAINT "confirmation_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
