const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createUser() {
  const user = await prisma.user.create({
    data: {
      name: 'Aiman',
      email: 'ak@example.com',
      password: '1111',
    },
  });

  console.log(user);
}

createUser()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
