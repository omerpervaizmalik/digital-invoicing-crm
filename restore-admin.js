const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'admin@getlegalsolution.com' },
    data: { role: 'ULTIMATE_ADMIN' }
  });
  console.log('Restored ULTIMATE_ADMIN role.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
