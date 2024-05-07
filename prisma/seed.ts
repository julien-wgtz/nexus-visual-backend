import { PrismaClient } from '@prisma/client';
import { connect } from 'http2';
const prisma = new PrismaClient();
async function main() {

  /**
   * 
   * USER GOD
   * 
   */
  const userAdminGod = await prisma.user.upsert({
    where: { email: 'julien.wgtz@outlook.com' },
    update: {},
    create: {
      email: 'julien.wgtz@outlook.com',
      password: '$2b$10$UjAqzANIwkVBPHUjyzyC8OU6ashGJVl7t5687J4xtiF9Xh0K9VALe',
      confirmed: true,
    },
  });
  const accountGod = await prisma.account.upsert({
    where: { ownerId: userAdminGod.id },
    update: {},
    create: {
      name: 'Compte GOD Admin',
      owner: { connect: { id: userAdminGod.id } },
      status: 'GOD',
      notionToken: "secret_LLJOVoRqvyvGhw7d16iZ6CuUQTMBTIdrRn3J93zbPEx"
    },
  });

  await prisma.folder.create({
    data: {
      account: { connect: { ownerId: accountGod.id } },
      order: 10000,
      isShadow: true
    },
  });

  /**
   * 
   * USER PRO
   * 
   */

  const userPro = await prisma.user.upsert({
    where: { email: 'pro@test.com' },
    update: {},
    create: {
      email: 'pro@test.com',
      password: '$2b$10$UjAqzANIwkVBPHUjyzyC8OU6ashGJVl7t5687J4xtiF9Xh0K9VALe',
      confirmed: true,
    },
  });
  const accountPro = await prisma.account.upsert({
    where: { ownerId: userPro.id },
    update: {},
    create: {
      name: 'Compte Pro',
      owner: { connect: { id: userPro.id } },
      status: 'PRO',
      notionToken: "secret_LLJOVoRqvyvGhw7d16iZ6CuUQTMBTIdrRn3J93zbPEx"
    },
  });

  await prisma.folder.create({
    data: {
      account: { connect: { ownerId: accountPro.id } },
      order: 10000,
      isShadow: true
    },
  });

  /**
   * 
   * USER FREE
   * 
   */

  const userFree = await prisma.user.upsert({
    where: { email: 'free@test.com' },
    update: {},
    create: {
      email: 'free@test.com',
      password: '$2b$10$UjAqzANIwkVBPHUjyzyC8OU6ashGJVl7t5687J4xtiF9Xh0K9VALe',
      confirmed: true,
    },
  });
  const accountFree = await prisma.account.upsert({
    where: { ownerId: userFree.id },
    update: {},
    create: {
      name: 'Compte Free',
      owner: { connect: { id: userFree.id } },
      status: 'FREE',
      notionToken: "secret_LLJOVoRqvyvGhw7d16iZ6CuUQTMBTIdrRn3J93zbPEx"
    },
  });

  await prisma.folder.create({
    data: {
      account: { connect: { ownerId: accountFree.id } },
      order: 10000,
      isShadow: true
    },
  });

  /**
   * 
   * USER TESTER 
   * 
   */

  const userTester = await prisma.user.upsert({
    where: { email: 'tester@test.com' },
    update: {},
    create: {
      email: 'tester@test.com',
      password: '$2b$10$UjAqzANIwkVBPHUjyzyC8OU6ashGJVl7t5687J4xtiF9Xh0K9VALe',
      confirmed: true,
    },
  });
  const accountTester = await prisma.account.upsert({
    where: { ownerId: userTester.id },
    update: {},
    create: {
      name: 'Compte Testeur',
      owner: { connect: { id: userTester.id } },
      status: 'TESTER',
      notionToken: "secret_LLJOVoRqvyvGhw7d16iZ6CuUQTMBTIdrRn3J93zbPEx"
    },
  });

  await prisma.folder.create({
    data: {
      account: { connect: { ownerId: accountTester.id } },
      order: 10000,
      isShadow: true
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
