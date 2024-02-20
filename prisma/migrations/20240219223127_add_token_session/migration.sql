-- CreateTable
CREATE TABLE "confirmationToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "confirmationToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "confirmationToken" ADD CONSTRAINT "confirmationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
