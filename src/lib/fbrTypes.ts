export interface FbrItem {
  hsCode: string;
  productDescription: string;
  rate: string;
  uoM: string;
  quantity: number;
  totalValues: number;
  valueSalesExcludingST: number;
  fixedNotifiedValueOrRetailPrice: number;
  salesTaxApplicable: number;
  salesTaxWithheldAtSource: number;
  extraTax: number;
  furtherTax: number;
  sroScheduleNo: string;
  fedPayable: number;
  discount: number;
  saleType: string;
  sroItemSerialNo: string;
}

export interface FbrInvoicePayload {
  invoiceType: string;
  invoiceDate: string;
  sellerNTNCNIC: string;
  sellerBusinessName: string;
  sellerProvince: string;
  sellerAddress: string;
  buyerNTNCNIC?: string;
  buyerBusinessName: string;
  buyerProvince: string;
  buyerAddress: string;
  buyerRegistrationType: string;
  invoiceRefNo?: string;
  scenarioId?: string; // For Sandbox testing
  items: FbrItem[];
}

export interface FbrValidationResponse {
  statusCode: string;
  status: string;
  errorCode?: string;
  error?: string;
  invoiceStatuses: {
    itemSNo: string;
    statusCode: string;
    status: string;
    invoiceNo?: string;
    errorCode?: string;
    error?: string;
  }[];
}

export interface FbrResponse {
  invoiceNumber?: string;
  dated?: string;
  validationResponse: FbrValidationResponse;
}
