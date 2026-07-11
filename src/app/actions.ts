'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getSession } from '../lib/session'
import { redirect } from 'next/navigation'
import { logActivity } from '../lib/activityLogger'

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
  return await prisma.user.findUnique({ where: { id: session.userId as string } });
}

// CLIENT ACTIONS
export async function getClients(tenantId: string) {
  return prisma.client.findMany({
    where: { tenantId },
    orderBy: { buyerBusinessName: 'asc' }
  })
}

export async function getClient(id: string) {
  return prisma.client.findUnique({
    where: { id }
  })
}

export async function createClient(data: any) {
  const branchName = data.branchName || "Main";
  const existing = await prisma.client.findFirst({
    where: {
      tenantId: data.tenantId,
      branchName: branchName,
      OR: [
        { buyerBusinessName: data.buyerBusinessName },
        ...(data.buyerNTNCNIC ? [{ buyerNTNCNIC: data.buyerNTNCNIC }] : [])
      ]
    }
  });
    if (existing) {
      return { error: "A Client with this Business Name or NTN/CNIC already exists for this branch. Please use a different Branch Name." };
    }

  data.branchName = branchName;
  const client = await prisma.client.create({ data })
  const user = await getCurrentUser()
  if (user && user.tenantId) {
    await logActivity(user.tenantId, user.id, 'CREATE', 'CLIENT', `Created client: ${client.buyerBusinessName}`)
  }
  revalidatePath('/clients')
}

export async function updateClient(id: string, data: any) {
  const currentClient = await prisma.client.findUnique({ where: { id } });
  if (!currentClient) throw new Error("Client not found");

  const branchName = data.branchName || "Main";
  const existing = await prisma.client.findFirst({
    where: {
      tenantId: currentClient.tenantId,
      id: { not: id },
      branchName: branchName,
      OR: [
        { buyerBusinessName: data.buyerBusinessName },
        ...(data.buyerNTNCNIC ? [{ buyerNTNCNIC: data.buyerNTNCNIC }] : [])
      ]
    }
  });
    if (existing) {
      return { error: "Another Client with this Business Name or NTN/CNIC already exists for this branch. Please use a different Branch Name." };
    }

  data.branchName = branchName;
  const client = await prisma.client.update({ where: { id }, data })
  const user = await getCurrentUser()
  if (user && user.tenantId) {
    await logActivity(user.tenantId, user.id, 'UPDATE', 'CLIENT', `Updated client: ${client.buyerBusinessName}`)
  }
  revalidatePath('/clients')
  return client
}

// SUPPLIER ACTIONS
export async function getSuppliers(tenantId: string) {
  return await prisma.supplier.findMany({ where: { tenantId } })
}

export async function getSupplier(id: string) {
  return await prisma.supplier.findUnique({ where: { id } })
}

export async function deleteClient(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPERVISOR' && user.role !== 'TENANT_ADMIN' && user.role !== 'ULTIMATE_ADMIN')) {
    throw new Error("Unauthorized to delete clients");
  }
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client || client.tenantId !== user.tenantId) {
    throw new Error("Client not found or unauthorized");
  }
  return await prisma.client.delete({ where: { id } });
}

export async function createSupplier(data: any) {
  const branchName = data.branchName || "Main";
  const existing = await prisma.supplier.findFirst({
    where: {
      tenantId: data.tenantId,
      branchName: branchName,
      OR: [
        { sellerBusinessName: data.sellerBusinessName },
        ...(data.sellerNTNCNIC ? [{ sellerNTNCNIC: data.sellerNTNCNIC }] : [])
      ]
    }
  });
  if (existing) {
    return { error: "A Supplier with this Business Name or NTN/CNIC already exists for this branch. Please use a different Branch Name." };
  }

  data.branchName = branchName;
  const supplier = await prisma.supplier.create({ data })
  const user = await getCurrentUser()
  if (user && user.tenantId) {
    await logActivity(user.tenantId, user.id, 'CREATE', 'SUPPLIER', `Created supplier: ${supplier.sellerBusinessName}`)
  }
  revalidatePath('/suppliers')
}

export async function updateSupplier(id: string, data: any) {
  const currentSupplier = await prisma.supplier.findUnique({ where: { id } });
  if (!currentSupplier) throw new Error("Supplier not found");

  const branchName = data.branchName || "Main";
  const existing = await prisma.supplier.findFirst({
    where: {
      tenantId: currentSupplier.tenantId,
      id: { not: id },
      branchName: branchName,
      OR: [
        { sellerBusinessName: data.sellerBusinessName },
        ...(data.sellerNTNCNIC ? [{ sellerNTNCNIC: data.sellerNTNCNIC }] : [])
      ]
    }
  });
    if (existing) {
      return { error: "Another Supplier with this Business Name or NTN/CNIC already exists for this branch. Please use a different Branch Name." };
    }

  data.branchName = branchName;
  const supplier = await prisma.supplier.update({ where: { id }, data })
  const user = await getCurrentUser()
  if (user && user.tenantId) {
    await logActivity(user.tenantId, user.id, 'UPDATE', 'SUPPLIER', `Updated supplier: ${supplier.sellerBusinessName}`)
  }
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

  const user = await getCurrentUser()
  if (user && user.tenantId) {
    await logActivity(user.tenantId, user.id, 'CREATE', 'ITEM', `Created catalog item: ${item.itemCode}`)
  }

  revalidatePath('/items');
}

export async function deleteSupplier(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPERVISOR' && user.role !== 'TENANT_ADMIN' && user.role !== 'ULTIMATE_ADMIN')) {
    throw new Error("Unauthorized to delete suppliers");
  }
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier || supplier.tenantId !== user.tenantId) {
    throw new Error("Supplier not found or unauthorized");
  }
  return await prisma.supplier.delete({ where: { id } });
}

// -------------------------------------------------------------------------------------------------
// VOUCHERS / INVOICES ACTIONS
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
  
  await logActivity(inv.tenantId, user.id, 'CREATE', 'INVOICE', `Created invoice: V-${inv.voucherNumber} (${inv.status})`)
  
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
  await logActivity(inv.tenantId, user.id, 'UPDATE', 'INVOICE', `Approved invoice: V-${inv.voucherNumber}`)
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
  const user = await getCurrentUser()
  if (user && user.tenantId) {
    await logActivity(user.tenantId, user.id, 'UPDATE', 'INVOICE', `Posted invoice to FBR: V-${inv.voucherNumber}`)
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
  const user = await getCurrentUser();
  if (user && user.tenantId) {
    await logActivity(user.tenantId, user.id, 'CREATE', 'STOCK', `Manual stock entry for ${itemCode} (${type}): Qty ${qty}`)
  }
  revalidatePath('/stock-register');
  revalidatePath('/items');
}

export async function updateItem(id: string, data: any) {
  const item = await prisma.item.update({
    where: { id },
    data
  });
  const user = await getCurrentUser();
  if (user && user.tenantId) {
    await logActivity(user.tenantId, user.id, 'UPDATE', 'ITEM', `Updated catalog item: ${item.itemCode}`)
  }
  revalidatePath('/items');
  return item;
}

