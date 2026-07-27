import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.invoiceItem.findMany({
    take: 5,
    orderBy: { invoiceId: 'desc' }
  });

  for (const item of items) {
    console.log(`InvoiceItem: ${item.id}, Rate: ${item.rate}, SaleType: ${item.saleType}`);
  }
}

main().finally(() => prisma.$disconnect());
