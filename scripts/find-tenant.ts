import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findFirst({where: {businessName: {contains: 'Trade Inn'}}});
  console.log('TENANT:', tenant);
  const user = await prisma.user.findFirst({where: {name: {contains: 'Imran Attaullah'}}});
  console.log('USER:', user);
}

main().finally(async () => {
  await prisma.$disconnect();
});
