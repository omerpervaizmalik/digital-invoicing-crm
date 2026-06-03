import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a default tenant (The company using the software)
  const tenant = await prisma.tenant.upsert({
    where: { ntnCnic: '1234567-8' },
    update: {},
    create: {
      businessName: 'Get Legal Solution Test Firm',
      ntnCnic: '1234567-8',
      province: 'Punjab',
      address: '123 Test Street, Lahore',
      businessNature: 'Services',
      sector: 'All Other Sectors',
    },
  })

  // Create a default client
  await prisma.client.create({
    data: {
      tenantId: tenant.id,
      buyerBusinessName: 'Alpha Logistics',
      buyerNTNCNIC: '9876543-2',
      buyerProvince: 'Sindh',
      buyerAddress: '456 Warehouse Rd, Karachi',
      buyerRegistrationType: 'Registered',
    },
  })

  // Create a default item
  await prisma.item.create({
    data: {
      tenantId: tenant.id,
      hsCode: '0101.2100',
      productDescription: 'Legal Consultation Services',
      rate: '18%',
      uoM: 'Numbers, pieces, units',
      fixedNotifiedValueOrRetailPrice: 15000,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
