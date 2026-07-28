import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const TARGET_TENANT_ID = 'cmr9dlxcz0000ji04qm0k6ye8';
  
  // Find all stock registers for this tenant where openingQty > 0 but closingQty == 0
  const stocks = await prisma.stockRegister.findMany({
    where: {
      tenantId: TARGET_TENANT_ID,
      openingQty: { gt: 0 },
      closingQty: 0
    }
  });
  
  console.log(`Found ${stocks.length} stock register rows to fix.`);
  
  for (const stock of stocks) {
    const closingQty = stock.openingQty + stock.purchasedQty - stock.domesticTaxableQty - stock.exemptQty - stock.zeroRatedQty;
    const closingVal = stock.openingVal + stock.purchasedVal - stock.domesticTaxableVal - stock.exemptVal - stock.zeroRatedVal;
    
    await prisma.stockRegister.update({
      where: { id: stock.id },
      data: {
        closingQty,
        closingVal
      }
    });
    console.log(`Updated Stock Register for ItemCode: ${stock.itemCode} to Closing Qty: ${closingQty}`);
  }
}

main().finally(() => prisma.$disconnect());
