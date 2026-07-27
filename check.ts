import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany({
    include: {
      fbrIntegration: true
    }
  });

  for (const t of tenants) {
    console.log(`Tenant: ${t.businessName}`);
    console.log(`NTN: ${t.ntnCnic}`);
    console.log(`FBR Token: ${t.fbrToken}`);
    console.log(`FBR PosID: ${t.fbrIntegration?.posId}`);
  }
}

main().finally(() => prisma.$disconnect());
