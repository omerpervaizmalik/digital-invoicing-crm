'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getSession } from '../lib/session'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function requireCompleteProfile() {
  const tenant = await getCurrentTenant();
  if (tenant && !tenant.isProfileComplete) {
    redirect('/settings/profile');
  }
  return tenant;
}

// Utility to get the current tenant based on the session
export async function getCurrentTenant() {
  const session = await getSession();
  if (!session || !session.tenantId) {
    return null;
  }
  
  const tenant = await prisma.tenant.findUnique({
    where: { id: session.tenantId as string }
  });
  
  return tenant;
}

// Utility to get current user
export async function getCurrentUser() {
  const session = await getSession();
  if (!session || !session.userId) return null;
  return await prisma.user.findUnique({ where: { id: session.userId } });
}

// CLIENT ACTIONS
export async function getClients(tenantId: string) {
  return await prisma.client.findMany({ where: { tenantId } })
}

export async function createClient(data: any) {
  await prisma.client.create({ data })
  revalidatePath('/clients')
}

// SUPPLIER ACTIONS
export async function getSuppliers(tenantId: string) {
  return await prisma.supplier.findMany({ where: { tenantId } })
}

export async function createSupplier(data: any) {
  await prisma.supplier.create({ data })
  revalidatePath('/suppliers')
}

export async function updateSupplier(id: string, data: any) {
  await prisma.supplier.update({ where: { id }, data })
  revalidatePath('/suppliers')
}

// ITEM ACTIONS
export async function getItems(tenantId: string) {
  const items = await prisma.item.findMany({ where: { tenantId } })
  const monthYear = new Date().toISOString().slice(0, 7);
  const stocks = await prisma.stockRegister.findMany({
    where: { tenantId, monthYear }
  });

  return items.map((item: any) => {
    const stock = stocks.find((s: any) => s.itemCode === item.itemCode);
    return { ...item, currentStock: stock ? stock.closingQty : 0 };
  });
}

export async function createItem(data: any) {
  const { initialStock, initialStockValue, ...itemData } = data;
  const item = await prisma.item.create({ data: itemData });
  
  // If user provided initial stock, push it to the Stock Register as Opening Balance
  if (initialStock > 0 || initialStockValue > 0) {
    const monthYear = new Date().toISOString().slice(0, 7);
    await addManualStock({
      tenantId: item.tenantId,
      itemCode: item.itemCode,
      monthYear,
      hsCode: item.hsCode,
      uoM: item.uoM,
      salesTaxRate: item.rate,
      val: parseFloat(initialStockValue) || 0,
      qty: parseFloat(initialStock) || 0,
      type: 'opening'
    });
  }

  revalidatePath('/items');
}

// INVOICE ACTIONS
export async function getInvoices(tenantId: string) {
  return await prisma.invoice.findMany({ 
    where: { tenantId },
    include: { client: true, supplier: true }
  })
}

import { processInvoiceToStock } from '../lib/stockService'

export async function createInvoice(data: any) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  
  const tenantId = data.tenant?.connect?.id || data.tenantId;
  const lastInvoice = await prisma.invoice.findFirst({
    where: { tenantId },
    orderBy: { voucherNumber: 'desc' }
  });
  
  data.voucherNumber = (lastInvoice?.voucherNumber || 0) + 1;
  data.creatorId = user.id;
  
  // Role-based logic
  if (user.role === 'STANDARD_USER') {
    data.status = 'PENDING_APPROVAL';
  } else {
    data.status = 'DRAFT';
  }
  
  const inv = await prisma.invoice.create({ data })
  
  if (inv.status !== 'PENDING_APPROVAL') {
    try {
      await processInvoiceToStock(inv.id)
    } catch (err) {
      console.error("Stock update failed:", err)
    }
  }
  
  revalidatePath('/vouchers')
  revalidatePath('/')
  return inv
}

export async function approveInvoice(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role === 'STANDARD_USER') throw new Error("Unauthorized to approve");

  const inv = await prisma.invoice.update({
    where: { id },
    data: { 
      status: 'DRAFT',
      approverId: user.id
    }
  });

  try {
    await processInvoiceToStock(inv.id)
  } catch (err) {
    console.error("Stock update failed on approval:", err)
  }
  revalidatePath('/vouchers')
  revalidatePath('/')
  return inv;
}

export async function postDraftToFBR(id: string) {
  const inv = await prisma.invoice.update({
    where: { id },
    data: { status: 'PENDING_FBR' }
  })
  try {
    await processInvoiceToStock(inv.id)
  } catch (err) {
    console.error("Stock update failed on draft post:", err)
  }
  revalidatePath('/vouchers')
  revalidatePath('/')
  revalidatePath('/stock-register')
}

export async function getInvoiceById(id: string) {
  return await prisma.invoice.findUnique({
    where: { id },
    include: { client: true, supplier: true, items: true, tenant: true }
  })
}

import fs from 'fs';
import path from 'path';

function getFbrReferences() {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'fbrReferences.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export async function searchHsCodes(query: string) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  
  const fbrReferences = getFbrReferences();
  return (fbrReferences.hsCodes || [])
    .filter((hs: any) => hs.code.toLowerCase().includes(q) || hs.description.toLowerCase().includes(q))
    .slice(0, 50); // limit to 50 results
}

export async function getFbrDropdownOptions() {
  const fbrReferences = getFbrReferences();
  return {
    documentTypes: fbrReferences.documentTypes || [],
    saleTypes: fbrReferences.saleTypes || [],
    buyerTypes: fbrReferences.buyerTypes || [],
    petroleumLevyOn: fbrReferences.petroleumLevyOn || [],
    provinces: fbrReferences.provinces || [],
    uoms: fbrReferences.uoms || [],
    rates: fbrReferences.rates || [],
    itemSrNos: fbrReferences.itemSrNos || [],
    sros: fbrReferences.sros || []
  };
}

import { recalculateClosingBalance } from '../lib/stockService';

export async function addManualStock(data: any) {
  const { tenantId, monthYear, itemCode, hsCode, uoM, salesTaxRate, val, qty, type } = data;

  // Ensure item exists in Catalog
  let item = await prisma.item.findFirst({ where: { tenantId, itemCode } });
  if (!item) {
    await prisma.item.create({
      data: {
        tenantId,
        itemCode,
        hsCode,
        productDescription: 'Stock Entry Auto-created',
        rate: salesTaxRate,
        uoM: uoM
      }
    });
  }

  // Update Stock
  let qtyField = 'purchasedQty';
  let valField = 'purchasedVal';
  
  if (type === 'opening') { qtyField = 'openingQty'; valField = 'openingVal'; }
  else if (type === 'domestic') { qtyField = 'domesticTaxableQty'; valField = 'domesticTaxableVal'; }
  else if (type === 'exempt') { qtyField = 'exemptQty'; valField = 'exemptVal'; }
  else if (type === 'zeroRated') { qtyField = 'zeroRatedQty'; valField = 'zeroRatedVal'; }

  await prisma.stockRegister.upsert({
    where: {
      tenantId_itemCode_monthYear: { tenantId, itemCode, monthYear }
    },
    update: {
      [qtyField]: { increment: qty },
      [valField]: { increment: val }
    },
    create: {
      tenantId,
      itemCode,
      hsCode,
      uoM,
      salesTaxRate: parseFloat(salesTaxRate) || 0,
      monthYear,
      [qtyField]: qty,
      [valField]: val
    }
  });

  await recalculateClosingBalance(tenantId, itemCode, monthYear);
  revalidatePath('/stock-register');
  revalidatePath('/items');
}

export async function updateItem(id: string, data: any) {
  const item = await prisma.item.update({
    where: { id },
    data
  });
  revalidatePath('/items');
  return item;
}

