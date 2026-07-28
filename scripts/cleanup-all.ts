import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const TARGET_TENANT_ID = 'cmr9dlxcz0000ji04qm0k6ye8';
  const TARGET_CREATOR_ID = 'cmr9dlxlp0002ji04qc7z3bnh';

  console.log('Cleaning up stranded dummy data...');

  await prisma.invoice.deleteMany({
    where: { 
      tenantId: TARGET_TENANT_ID,
      creatorId: TARGET_CREATOR_ID,
      status: 'DRAFT',
      invoiceRefNo: { startsWith: 'SN0' }
    }
  });
  console.log('Deleted dummy invoices.');

  await prisma.stockRegister.deleteMany({
    where: {
      tenantId: TARGET_TENANT_ID,
      openingQty: 100000
    }
  });
  console.log('Deleted dummy stock registers.');

  await prisma.item.deleteMany({
    where: {
      tenantId: TARGET_TENANT_ID,
      productDescription: { in: ['test', 'Dummy Product', 'product Description41', 'TEST', ''] }
    }
  });
  console.log('Deleted dummy items.');

  await prisma.client.deleteMany({
    where: {
      tenantId: TARGET_TENANT_ID,
      businessName: 'FERTILIZER MANUFAC IRS NEW'
    }
  });
  console.log('Deleted dummy clients.');

  console.log('Cleanup complete.');
}

main().finally(() => prisma.$disconnect());
