import { PrismaClient } from '@prisma/client';
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
      notionToken: 'secret_3fhv1cScjcPwOquKJsCPpQHMOzLKJZVcD4pqVyI2tNP',
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
