import { Invoice, InvoiceItem, Tenant, Client } from "@prisma/client";
import { FbrInvoicePayload, FbrItem } from "./fbrTypes";

type FullInvoice = Invoice & {
  tenant: Tenant;
  client: Client;
  items: InvoiceItem[];
};

export function generateFbrPayload(invoice: FullInvoice, isSandbox: boolean = false, scenarioId?: string): FbrInvoicePayload {
  const f = (num: number | null | undefined, dec: number = 2) => num ? Number(num.toFixed(dec)) : 0;

  const fbrItems: FbrItem[] = invoice.items.map(item => ({
    hsCode: item.hsCode,
    productDescription: item.productDescription,
    rate: f(item.rate, 2),
    uoM: item.uoM,
    quantity: f(item.quantity, 4),
    totalValues: f(item.totalValues, 2),
    valueSalesExcludingST: f(item.valueSalesExcludingST, 2),
    fixedNotifiedValueOrRetailPrice: f(item.fixedNotifiedValueOrRetailPrice, 2),
    salesTaxApplicable: f(item.salesTaxApplicable, 2),
    salesTaxWithheldAtSource: f(item.salesTaxWithheldAtSource, 2),
    extraTax: f(item.extraTax, 2),
    furtherTax: f(item.furtherTax, 2),
    sroScheduleNo: item.sroScheduleNo || "",
    fedPayable: f(item.fedPayable, 2),
    discount: f(item.discount, 2),
    saleType: item.saleType,
    sroItemSerialNo: item.sroItemSerialNo || "",
  }));

  const payload: FbrInvoicePayload = {
    invoiceType: invoice.invoiceType, // "Sale Invoice" or "Debit Note"
    // FBR expects YYYY-MM-DD
    invoiceDate: invoice.invoiceDate.toISOString().split("T")[0],
    sellerNTNCNIC: invoice.tenant.ntnCnic,
    sellerBusinessName: invoice.tenant.businessName,
    sellerProvince: invoice.tenant.province,
    sellerAddress: invoice.tenant.address,
    
    buyerBusinessName: invoice.client.buyerBusinessName,
    buyerProvince: invoice.client.buyerProvince,
    buyerAddress: invoice.client.buyerAddress,
    buyerRegistrationType: invoice.client.buyerRegistrationType, // "Registered" or "Unregistered"
    
    invoiceRefNo: invoice.invoiceRefNo || "",
    items: fbrItems,
  };

  if (invoice.client.buyerRegistrationType === "Registered" && invoice.client.buyerNTNCNIC) {
    payload.buyerNTNCNIC = invoice.client.buyerNTNCNIC;
  } else if (invoice.client.buyerNTNCNIC) {
    // FBR docs state buyerNTNCNIC is optional in case of Unregistered, but we send it if we have it
    payload.buyerNTNCNIC = invoice.client.buyerNTNCNIC;
  } else {
    // If it's unregistered and no CNIC, FBR docs show a string of 13 zeros, or just leave it out.
    // We'll leave it undefined to let FBR validate it correctly.
  }

  // Inject scenarioId only for Sandbox environments
  if (isSandbox && scenarioId) {
    payload.scenarioId = scenarioId;
  }

  return payload;
}
