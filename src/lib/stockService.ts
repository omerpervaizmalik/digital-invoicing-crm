import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function processInvoiceToStock(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true, client: true, supplier: true }
  });

  if (!invoice) throw new Error('Invoice not found');
  if (invoice.status === 'DRAFT') return; // Only process finalized or pending FBR

  const monthYear = new Date(invoice.invoiceDate).toISOString().slice(0, 7); // e.g., '2026-06'

  for (const item of invoice.items) {
    // Upsert the StockRegister row for this itemCode and Month
    await prisma.stockRegister.upsert({
      where: {
        tenantId_itemCode_monthYear: {
          tenantId: invoice.tenantId,
          itemCode: item.itemCode,
          monthYear: monthYear
        }
      },
      update: {},
      create: {
        tenantId: invoice.tenantId,
        itemCode: item.itemCode,
        hsCode: item.hsCode,
        uoM: item.uoM,
        salesTaxRate: parseFloat(item.rate) || 0,
        monthYear: monthYear
      }
    });

    // Now update quantities based on invoice type
    const invType = invoice.invoiceType;
    let qtyChange = item.quantity;
    let valChange = item.valueSalesExcludingST;

    if (invType === 'Purchase Invoice' || invType === 'Debit Note') {
      // Debit Note = Purchase Return, so it reduces purchased quantity
      if (invType === 'Debit Note') {
        qtyChange = -qtyChange;
        valChange = -valChange;
      }
      await prisma.stockRegister.update({
        where: {
          tenantId_itemCode_monthYear: {
            tenantId: invoice.tenantId,
            itemCode: item.itemCode,
            monthYear: monthYear
          }
        },
        data: {
          purchasedQty: { increment: qtyChange },
          purchasedVal: { increment: valChange }
        }
      });
    } else {
      // It's a Sale (Sale Invoice) or Sale Return (Credit Note)
      if (invType === 'Credit Note') {
        qtyChange = -qtyChange;
        valChange = -valChange;
      }
      
      let qtyField = 'domesticTaxableQty';
      let valField = 'domesticTaxableVal';

      const saleType = item.saleType || '';
      const buyerType = invoice.client?.buyerRegistrationType || '';

      if (saleType.includes('Exempt')) {
        qtyField = 'exemptQty';
        valField = 'exemptVal';
      } else if (saleType.includes('Zero') || buyerType.includes('Export')) {
        qtyField = 'zeroRatedQty';
        valField = 'zeroRatedVal';
      }

      await prisma.stockRegister.update({
        where: {
          tenantId_itemCode_monthYear: {
            tenantId: invoice.tenantId,
            itemCode: item.itemCode,
            monthYear: monthYear
          }
        },
        data: {
          [qtyField]: { increment: qtyChange },
          [valField]: { increment: valChange }
        }
      });
    }

    // Recalculate closing balances
    await recalculateClosingBalance(invoice.tenantId, item.itemCode, monthYear);
  }
}

export async function recalculateClosingBalance(tenantId: string, itemCode: string, monthYear: string) {
  const stock = await prisma.stockRegister.findUnique({
    where: {
      tenantId_itemCode_monthYear: { tenantId, itemCode, monthYear }
    }
  });

  if (!stock) return;

  const closingQty = stock.openingQty + stock.purchasedQty - stock.domesticTaxableQty - stock.exemptQty - stock.zeroRatedQty;
  const closingVal = stock.openingVal + stock.purchasedVal - stock.domesticTaxableVal - stock.exemptVal - stock.zeroRatedVal;

  await prisma.stockRegister.update({
    where: { id: stock.id },
    data: {
      closingQty: closingQty,
      closingVal: closingVal
    }
  });
}
