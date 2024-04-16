import { PrismaClient } from '@prisma/client';
import { connect } from 'http2';
const prisma = new PrismaClient();
async function main() {
  const userAdmin = await prisma.user.upsert({
    where: { email: 'julien.wgtz@outlook.com' },
    update: {},
    create: {
      email: 'julien.wgtz@outlook.com',
      password: '$2b$10$UjAqzANIwkVBPHUjyzyC8OU6ashGJVl7t5687J4xtiF9Xh0K9VALe',
      confirmed: true,
      role: 'ADMIN',
    },
  });
  const acountAdmin = await prisma.account.upsert({
    where: { ownerId: userAdmin.id },
    update: {},
    create: {
      name: 'Compte Admin',
      owner: { connect: { id: userAdmin.id } },
      status: 'GOD',
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
