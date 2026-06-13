const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.stockRegister.deleteMany();
}
main().then(() => console.log('Deleted')).catch(console.error).finally(() => prisma.$disconnect());
