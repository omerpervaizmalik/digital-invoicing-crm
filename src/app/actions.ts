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
  const invoices = await prisma.invoice.findMany({ 
    where: { tenantId },
    include: { client: true, supplier: true, items: true },
    orderBy: { createdAt: 'desc' }
  });

  return invoices.map(inv => {
    let totalAmount = 0;
    if (inv.items && inv.items.length > 0) {
      totalAmount = inv.items.reduce((sum, item) => sum + (item.totalValues || 0) + (item.furtherTax || 0) + (item.extraTax || 0) + (item.fedPayable || 0) - (item.discount || 0), 0);
    }
    return { ...inv, totalAmount };
  });
}

import { processInvoiceToStock, rollbackInvoiceFromStock } from '../lib/stockService'

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
  let initialStatus = 'DRAFT';
  if (data.invoiceType === 'Purchase Invoice') {
    initialStatus = 'VALID';
  } else if (user.role === 'STANDARD_USER') {
    initialStatus = 'PENDING_APPROVAL';
  }
  data.status = initialStatus;
  
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

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) throw new Error("Invoice not found");

  const newStatus = invoice.invoiceType === 'Purchase Invoice' ? 'VALID' : 'DRAFT';

  const inv = await prisma.invoice.update({
    where: { id },
    data: { 
      status: newStatus,
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

export async function deleteInvoice(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPERVISOR' && user.role !== 'TENANT_ADMIN' && user.role !== 'ULTIMATE_ADMIN')) {
    throw new Error("Unauthorized to delete invoices");
  }
  
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice || invoice.tenantId !== user.tenantId) {
    throw new Error("Invoice not found or unauthorized");
  }
  
  if (invoice.status !== 'DRAFT' && invoice.status !== 'PENDING_APPROVAL' && invoice.invoiceType !== 'Purchase Invoice') {
     throw new Error("Cannot delete a finalized invoice. Please use Credit Note or Debit Note instead.");
  }

  // Rollback stock for VALID Purchase Invoices
  if (invoice.status === 'VALID' || invoice.status === 'PENDING_FBR') {
    try {
      await rollbackInvoiceFromStock(invoice.id);
    } catch (err) {
      console.error("Stock rollback failed on delete:", err);
    }
  }

  await prisma.invoice.delete({ where: { id } });
  
  await logActivity(user.tenantId, user.id, 'DELETE', 'INVOICE', `Deleted invoice: V-${invoice.voucherNumber}`);
  revalidatePath('/vouchers');
  revalidatePath('/stock-register');
}

export async function updateInvoice(id: string, data: any) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  
  const existingInvoice = await prisma.invoice.findUnique({ where: { id }, include: { items: true } });
  if (!existingInvoice || existingInvoice.tenantId !== user.tenantId) {
    throw new Error("Invoice not found or unauthorized");
  }
  
  if (existingInvoice.status !== 'DRAFT' && existingInvoice.status !== 'PENDING_APPROVAL' && existingInvoice.invoiceType !== 'Purchase Invoice') {
     throw new Error("Cannot edit a finalized invoice. Please use Credit Note or Debit Note instead.");
  }

  // Rollback existing stock first
  if (existingInvoice.status === 'VALID' || existingInvoice.status === 'PENDING_FBR') {
    try {
      await rollbackInvoiceFromStock(existingInvoice.id);
    } catch (err) {
      console.error("Stock rollback failed on update:", err);
    }
  }

  // Determine status (could change if type changed to/from Purchase Invoice)
  let newStatus = 'DRAFT';
  if (data.invoiceType === 'Purchase Invoice') {
    newStatus = 'VALID';
  } else if (user.role === 'STANDARD_USER') {
    newStatus = 'PENDING_APPROVAL';
  }
  data.status = newStatus;

  // Extract items for update
  const { items, ...invoiceData } = data;

  // Delete all existing items, then recreate
  await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });

  const updatedInvoice = await prisma.invoice.update({
    where: { id },
    data: {
      ...invoiceData,
      items: {
        create: items.create // we expect items to have { create: [...] } similar to createInvoice
      }
    }
  });

  if (updatedInvoice.status !== 'PENDING_APPROVAL' && updatedInvoice.status !== 'DRAFT') {
    try {
      await processInvoiceToStock(updatedInvoice.id);
    } catch (err) {
      console.error("Stock update failed on invoice update:", err);
    }
  }

  await logActivity(user.tenantId, user.id, 'UPDATE', 'INVOICE', `Updated invoice: V-${updatedInvoice.voucherNumber} (${updatedInvoice.status})`);
  revalidatePath('/vouchers');
  revalidatePath('/stock-register');
  return updatedInvoice;
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

export async function loadPreviousMonthStock(tenantId: string, currentMonth: string) {
  // Parse current month (YYYY-MM)
  const [yearStr, monthStr] = currentMonth.split('-');
  let year = parseInt(yearStr);
  let month = parseInt(monthStr);

  month -= 1;
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  const prevMonthStr = `${year}-${String(month).padStart(2, '0')}`;

  const prevMonthData = await prisma.stockRegister.findMany({
    where: { tenantId, monthYear: prevMonthStr }
  });

  if (prevMonthData.length === 0) {
    return { success: false, error: 'No stock data found for previous month.' };
  }

  try {
    for (const prevRow of prevMonthData) {
      // Create or update current month entry
      await prisma.stockRegister.upsert({
        where: {
          tenantId_itemCode_monthYear: {
            tenantId,
            itemCode: prevRow.itemCode,
            monthYear: currentMonth
          }
        },
        update: {
          openingQty: prevRow.closingQty,
          openingVal: prevRow.closingVal
        },
        create: {
          tenantId,
          itemCode: prevRow.itemCode,
          hsCode: prevRow.hsCode,
          uoM: prevRow.uoM,
          salesTaxRate: prevRow.salesTaxRate,
          monthYear: currentMonth,
          openingQty: prevRow.closingQty,
          openingVal: prevRow.closingVal
        }
      });

      // Recalculate current month's closing
      await recalculateClosingBalance(tenantId, prevRow.itemCode, currentMonth);
    }
    revalidatePath('/stock-register');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to load previous month data.' };
  }
}

export async function updateStockOpeningBalance(stockId: number, qty: number, val: number) {
  try {
    const stock = await prisma.stockRegister.findUnique({ where: { id: stockId }});
    if (!stock) return { success: false, error: 'Stock record not found' };

    await prisma.stockRegister.update({
      where: { id: stockId },
      data: { openingQty: qty, openingVal: val }
    });

    await recalculateClosingBalance(stock.tenantId, stock.itemCode, stock.monthYear);
    revalidatePath('/stock-register');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update opening balance.' };
  }
}

export async function bulkUploadItems(items: any[]) {
  const tenant = await getCurrentTenant();
  if (!tenant) throw new Error("Unauthorized: No active tenant session.");
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const results = {
    created: 0,
    updated: 0,
    errors: [] as string[]
  };

  const monthYear = new Date().toISOString().slice(0, 7);

  for (const itemData of items) {
    try {
      const {
        itemCode,
        hsCode,
        productDescription,
        rate,
        uoM,
        unitPrice,
        fixedNotifiedValueOrRetailPrice,
        saleType,
        sroScheduleNo,
        sroItemSerialNo,
        petroleumLevyOn,
        initialStock,
        initialStockValue
      } = itemData;

      if (!itemCode || !hsCode || !productDescription) {
        results.errors.push(`Skipped row with missing code, description, or HS code.`);
        continue;
      }

      const existing = await prisma.item.findUnique({
        where: {
          tenantId_itemCode: {
            tenantId: tenant.id,
            itemCode: itemCode.trim().toUpperCase()
          }
        }
      });

      const parsedUnitPrice = parseFloat(unitPrice) || 0;
      const parsedRetailPrice = parseFloat(fixedNotifiedValueOrRetailPrice) || 0;
      const parsedInitialStock = parseFloat(initialStock) || 0;
      const parsedInitialStockValue = parseFloat(initialStockValue) || 0;
      
      const payload = {
        hsCode: String(hsCode).trim(),
        productDescription: String(productDescription).trim(),
        rate: String(rate).trim(),
        uoM: String(uoM).trim(),
        unitPrice: parsedUnitPrice,
        fixedNotifiedValueOrRetailPrice: parsedRetailPrice,
        saleType: String(saleType || "Goods at standard rate (default)").trim(),
        sroScheduleNo: sroScheduleNo ? String(sroScheduleNo).trim() : null,
        sroItemSerialNo: sroItemSerialNo ? String(sroItemSerialNo).trim() : null,
        petroleumLevyOn: petroleumLevyOn ? String(petroleumLevyOn).trim() : null,
      };

      let dbItem;
      if (existing) {
        dbItem = await prisma.item.update({
          where: { id: existing.id },
          data: payload
        });
        results.updated++;
      } else {
        dbItem = await prisma.item.create({
          data: {
            ...payload,
            itemCode: itemCode.trim().toUpperCase(),
            tenantId: tenant.id
          }
        });
        results.created++;
      }

      // Handle stock register opening balance for this month if initial stock is provided
      if (parsedInitialStock > 0 || parsedInitialStockValue > 0) {
        const existingStock = await prisma.stockRegister.findUnique({
          where: {
            tenantId_itemCode_monthYear: {
              tenantId: tenant.id,
              itemCode: dbItem.itemCode,
              monthYear
            }
          }
        });

        if (existingStock) {
          await prisma.stockRegister.update({
            where: { id: existingStock.id },
            data: {
              openingQty: parsedInitialStock,
              openingVal: parsedInitialStockValue
            }
          });
          await recalculateClosingBalance(tenant.id, dbItem.itemCode, monthYear);
        } else {
          await addManualStock({
            tenantId: tenant.id,
            itemCode: dbItem.itemCode,
            monthYear,
            hsCode: dbItem.hsCode,
            uoM: dbItem.uoM,
            salesTaxRate: dbItem.rate,
            val: parsedInitialStockValue,
            qty: parsedInitialStock,
            type: 'opening'
          });
        }
      }

    } catch (err: any) {
      console.error("Bulk upload item error:", err);
      results.errors.push(`Error saving product ${itemData.itemCode || 'Unknown'}: ${err.message || err}`);
    }
  }

  if (results.created > 0 || results.updated > 0) {
    await logActivity(tenant.id, user.id, 'CREATE', 'ITEM', `Bulk uploaded products: Created ${results.created}, Updated ${results.updated}`);
  }

  revalidatePath('/products');
  revalidatePath('/items');
  revalidatePath('/stock-register');
  
  return results;
}
