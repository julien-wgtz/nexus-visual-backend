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
      accountUser: {
        create: {
          role: 'OWNER',
          account: {
            create: {
              name: 'Compte Admin',
              status: 'GOD',
              notionToken: "secret_LLJOVoRqvyvGhw7d16iZ6CuUQTMBTIdrRn3J93zbPEx"
              },
          },
        },
      }
    },
    include: {
      accountUser: {
        include: {
          account: true
        }
      }
    }
  });

  await prisma.user.update({
    where: {
      id: userAdminGod.id,
    },
    data: {
      currentAccountId: userAdminGod.accountUser[0].account.id,
    }
  });

  await prisma.folder.create({
    data: {
      accountId: userAdminGod.accountUser[0].account.id,
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
      accountUser: {
        create: {
          role: 'OWNER',
          account: {
            create: {
              name: 'Compte Pro',
              status: 'PRO',
              notionToken: "secret_LLJOVoRqvyvGhw7d16iZ6CuUQTMBTIdrRn3J93zbPEx"
            }
          },
        },
      }
    },
    include: {
      accountUser: {
        include: {
          account: true
        }
      }
    }
  });

  await prisma.user.update({
    where: {
      id: userPro.id,
    },
    data: {
      currentAccountId: userPro.accountUser[0].account.id,
    }
  });

  await prisma.folder.create({
    data: {
      accountId: userPro.accountUser[0].account.id,
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
      accountUser: {
        create: {
          role: 'OWNER',
          account: {
            create: {
              name: 'Compte Free',
              status: 'FREE',
              notionToken: "secret_LLJOVoRqvyvGhw7d16iZ6CuUQTMBTIdrRn3J93zbPEx"
            },
          },
        }
      }
    },
    include: {
      accountUser: {
        include: {
          account: true
        }
      }
    }
  });

  await prisma.user.update({
    where: {
      id: userFree.id,
    },
    data: {
      currentAccountId: userFree.accountUser[0].account.id,
    }
  });

  await prisma.folder.create({
    data: {
      accountId: userFree.accountUser[0].account.id,
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
      accountUser: {
        create: {
          role: 'OWNER',
          account: {
            create: {
              name: 'Compte Tester',
              status: 'TESTER',
              notionToken: "secret_LLJOVoRqvyvGhw7d16iZ6CuUQTMBTIdrRn3J93zbPEx"
            }
          }
        }
      }
    },
    include: {
      accountUser: {
        include: {
          account: true
        }
      }
    }
  });

  await prisma.user.update({
    where: {
      id: userTester.id,
    },
    data: {
      currentAccountId: userTester.accountUser[0].account.id,
    }
  }); 

  await prisma.folder.create({
    data: {
      accountId: userTester.accountUser[0].account.id,
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
