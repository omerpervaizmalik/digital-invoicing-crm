import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const trackerPath = path.join(__dirname, '.sandbox-seed-tracker.json');

  if (!fs.existsSync(trackerPath)) {
    console.log('No sandbox tracker file found. Nothing to teardown.');
    return;
  }

  console.log('Reading sandbox tracker file...');
  const tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));

  // Delete Invoices
  if (tracker.invoiceIds && tracker.invoiceIds.length > 0) {
    console.log(`Deleting ${tracker.invoiceIds.length} invoices...`);
    await prisma.invoice.deleteMany({
      where: { id: { in: tracker.invoiceIds } }
    });
  }

  // Delete Items
  if (tracker.itemIds && tracker.itemIds.length > 0) {
    console.log(`Deleting ${tracker.itemIds.length} items...`);
    await prisma.item.deleteMany({
      where: { id: { in: tracker.itemIds } }
    });
  }

  // Delete Clients
  if (tracker.clientIds && tracker.clientIds.length > 0) {
    console.log(`Deleting ${tracker.clientIds.length} clients...`);
    await prisma.client.deleteMany({
      where: { id: { in: tracker.clientIds } }
    });
  }

  // Delete Tenants
  // Note: Only deleting tenants that were completely created by the seed script.
  if (tracker.tenantIds && tracker.tenantIds.length > 0) {
    console.log(`Deleting ${tracker.tenantIds.length} tenants...`);
    await prisma.tenant.deleteMany({
      where: { id: { in: tracker.tenantIds } }
    });
  }

  console.log('Teardown complete. Removing tracker file...');
  fs.unlinkSync(trackerPath);
  
  console.log('Successfully removed all sandbox dummy data!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
