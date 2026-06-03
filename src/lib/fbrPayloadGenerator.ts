import { Invoice, InvoiceItem, Tenant, Client } from "@prisma/client";
import { FbrInvoicePayload, FbrItem } from "./fbrTypes";

type FullInvoice = Invoice & {
  tenant: Tenant;
  client: Client;
  items: InvoiceItem[];
};

export function generateFbrPayload(invoice: FullInvoice, isSandbox: boolean = false, scenarioId?: string): FbrInvoicePayload {
  const fbrItems: FbrItem[] = invoice.items.map(item => ({
    hsCode: item.hsCode,
    productDescription: item.productDescription,
    rate: item.rate,
    uoM: item.uoM,
    quantity: item.quantity,
    totalValues: item.totalValues,
    valueSalesExcludingST: item.valueSalesExcludingST,
    fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice,
    salesTaxApplicable: item.salesTaxApplicable,
    salesTaxWithheldAtSource: item.salesTaxWithheldAtSource,
    extraTax: item.extraTax,
    furtherTax: item.furtherTax,
    sroScheduleNo: item.sroScheduleNo || "",
    fedPayable: item.fedPayable,
    discount: item.discount,
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
