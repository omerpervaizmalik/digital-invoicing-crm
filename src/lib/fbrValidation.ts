import { FbrInvoicePayload } from "./fbrTypes";

export interface ValidationError {
  code: string;
  message: string;
}

/**
 * Smart Pre-Validation Layer
 * Validates outgoing JSON payloads against specific FBR error rules
 * to prevent invalid payloads from hitting the network.
 */
export function validateFbrPayload(payload: FbrInvoicePayload): ValidationError[] {
  const errors: ValidationError[] = [];

  // Code 0005: Date format must be strictly YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(payload.invoiceDate)) {
    errors.push({
      code: "0005",
      message: "Invoice date is not in proper format. Please use YYYY-MM-DD format.",
    });
  }

  // Code 0058: Block Self-invoicing
  if (payload.buyerNTNCNIC && payload.sellerNTNCNIC === payload.buyerNTNCNIC) {
    errors.push({
      code: "0058",
      message: "Self-invoicing is not allowed. Buyer and Seller Registration numbers cannot be the same.",
    });
  }

  // Code 0026: Debit/Credit Note Reference
  if (payload.invoiceType === "Debit Note" && !payload.invoiceRefNo) {
    errors.push({
      code: "0026",
      message: "Invoice Reference No. is a mandatory requirement for Debit notes. Please provide a valid reference.",
    });
  }

  // Item Level Validations
  payload.items.forEach((item, index) => {
    // Code 0050: Cotton Ginners specific logic
    if (item.saleType === "Cotton ginners") {
      if (item.salesTaxWithheldAtSource !== 0 && item.salesTaxWithheldAtSource !== item.salesTaxApplicable) {
        errors.push({
          code: "0050",
          message: `Item ${index + 1}: For sale type 'Cotton ginners', Sales Tax Withheld must be equal to Sales Tax or zero.`,
        });
      }
    }

    // Code 0088: Invoice Number Alphanumeric check (Handled by FBR but we can pre-warn if we auto-gen)
    // Code 0021 / 0167: Value of Sales Excl ST check
    if (!item.valueSalesExcludingST || item.valueSalesExcludingST <= 0) {
      errors.push({
        code: "0021",
        message: `Item ${index + 1}: Value of Sales Excl. ST / Quantity cannot be empty or zero.`,
      });
    }
  });

  return errors;
}
