const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { email: { contains: 'imtradeinn', mode: 'insensitive' } }
  });
  console.log("Found users:", users);
}
main().finally(() => prisma.$disconnect());
