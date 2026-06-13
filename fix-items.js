const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const items = await prisma.item.findMany();
  for (let item of items) {
    if (!item.itemCode) {
      await prisma.item.update({
        where: { id: item.id },
        data: { itemCode: `ITM-${item.id.substring(0, 6).toUpperCase()}` }
      });
    }
  }
  console.log("Updated existing items.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
