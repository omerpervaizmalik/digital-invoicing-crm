const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany();
  console.dir(tenants, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
