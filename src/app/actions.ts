'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// MOCK: Assuming the first tenant is the logged in user for this prototype
export async function getCurrentTenant() {
  let tenant = await prisma.tenant.findFirst()
  if (!tenant) {
    // Auto-seed for prototyping using upsert to avoid build-time race conditions
    tenant = await prisma.tenant.upsert({
      where: { ntnCnic: '1234567-8' },
      update: {},
      create: {
        businessName: 'Get Legal Solution Test Firm',
        ntnCnic: '1234567-8',
        province: 'Punjab',
        address: '123 Legal Ave',
        businessNature: 'Services',
        sector: 'Law',
      }
    })
    // Only seed the client if we're also creating the tenant
    const existingClient = await prisma.client.findFirst({ where: { tenantId: tenant.id } })
    if (!existingClient) {
      await prisma.client.create({
        data: {
          tenantId: tenant.id,
          buyerBusinessName: 'Alpha Logistics',
          buyerNTNCNIC: '9876543-2',
          buyerProvince: 'Sindh',
          buyerAddress: '456 Warehouse Rd',
          buyerRegistrationType: 'Registered',
        }
      })
    }
  }
  return tenant
}

// CLIENT ACTIONS
export async function getClients(tenantId: string) {
  return await prisma.client.findMany({ where: { tenantId } })
}

export async function createClient(data: any) {
  await prisma.client.create({ data })
  revalidatePath('/clients')
}

// ITEM ACTIONS
export async function getItems(tenantId: string) {
  return await prisma.item.findMany({ where: { tenantId } })
}

export async function createItem(data: any) {
  await prisma.item.create({ data })
  revalidatePath('/items')
}

// INVOICE ACTIONS
export async function getInvoices(tenantId: string) {
  return await prisma.invoice.findMany({ 
    where: { tenantId },
    include: { client: true }
  })
}

export async function createInvoice(data: any) {
  const inv = await prisma.invoice.create({ data })
  revalidatePath('/vouchers')
  revalidatePath('/')
  return inv
}

export async function getInvoiceById(id: string) {
  return await prisma.invoice.findUnique({
    where: { id },
    include: { client: true, items: true, tenant: true }
  })
}
