import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Tracker object to keep IDs of seeded data
const tracker = {
  tenantIds: [] as string[],
  clientIds: [] as string[],
  itemIds: [] as string[],
  invoiceIds: [] as string[],
  stockRegisterIds: [] as number[]
};


const scenarios = [
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-10",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerNTNCNIC": "8885801",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "2046004",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "",
    "scenarioId": "SN001",
    "buyerRegistrationType": "Registered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "test",
        "rate": "18%",
        "uoM": "Numbers, pieces, units",
        "quantity": 400,
        "totalValues": 0,
        "valueSalesExcludingST": 1000,
        "fixedNotifiedValueOrRetailPrice": 0.0,
        "salesTaxApplicable": 180,
        "salesTaxWithheldAtSource": 0,
        "extraTax": "",
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Goods at standard rate (default)",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-10",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerNTNCNIC": "8885801",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1234567",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "",
    "scenarioId": "SN002",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "test",
        "rate": "18%",
        "uoM": "Numbers, pieces, units",
        "quantity": 400,
        "totalValues": 0,
        "valueSalesExcludingST": 1000,
        "fixedNotifiedValueOrRetailPrice": 0.0,
        "salesTaxApplicable": 180,
        "salesTaxWithheldAtSource": 0,
        "extraTax": "",
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Goods at standard rate (default)",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-04-21",
    "sellerBusinessName": "Company 7",
    "sellerNTNCNIC": "8885801",
    "sellerProvince": "Sindh",
    "buyerNTNCNIC": "3710505701479",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "sellerAddress": "Karachi",
    "invoiceRefNo": "0",
    "scenarioId": "SN003",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "7214.1010",
        "productDescription": "",
        "rate": "18%",
        "uoM": "MT",
        "quantity": 1,
        "totalValues": 0,
        "valueSalesExcludingST": 205000.0,
        "fixedNotifiedValueOrRetailPrice": 0.0,
        "salesTaxApplicable": 36900,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Steel melting and re-rolling",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-26",
    "sellerNTNCNIC": "4130276175937",
    "sellerBusinessName": "Company 8",
    "sellerAddress": "Karachi",
    "sellerProvince": "Sindh",
    "buyerNTNCNIC": "3710505701479",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "SI-20250421-001",
    "scenarioId": "SN004",
    "items": [
      {
        "hsCode": "7204.1010",
        "productDescription": "",
        "rate": "18%",
        "uoM": "MT",
        "quantity": 1,
        "totalValues": 0,
        "valueSalesExcludingST": 175000,
        "salesTaxApplicable": 31500,
        "fixedNotifiedValueOrRetailPrice": 0,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Ship breaking",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-06-30",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "B2",
    "sellerAddress": "Karachi",
    "sellerProvince": "Sindh",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "",
    "scenarioId": "SN005",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0102.2930",
        "productDescription": "product Description41",
        "rate": "1%",
        "uoM": "Numbers, pieces, units",
        "quantity": 1.0,
        "totalValues": 0.00,
        "valueSalesExcludingST": 1000.00,
        "fixedNotifiedValueOrRetailPrice": 0.00,
        "salesTaxApplicable": 10,
        "salesTaxWithheldAtSource": 50.23,
        "extraTax": "",
        "furtherTax": 120.00,
        "sroScheduleNo": "EIGHTH SCHEDULE Table 1",
        "fedPayable": 50.36,
        "discount": 56.36,
        "saleType": "Goods at Reduced Rate",
        "sroItemSerialNo": "82"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-07-01",
    "sellerBusinessName": "Company 8",
    "sellerNTNCNIC": "8885801",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "2046004",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "SI-20250515-001",
    "scenarioId": "SN006",
    "buyerRegistrationType": "Registered",
    "items": [
      {
        "hsCode": "0102.2930",
        "productDescription": "product Description41",
        "rate": "Exempt",
        "uoM": "Numbers, pieces, units",
        "quantity": 1.0,
        "totalValues": 0.00,
        "valueSalesExcludingST": 10,
        "fixedNotifiedValueOrRetailPrice": 0.00,
        "salesTaxApplicable": 0,
        "salesTaxWithheldAtSource": 50.23,
        "extraTax": "",
        "furtherTax": 120.00,
        "sroScheduleNo": "6th Schd Table I",
        "fedPayable": 50.36,
        "discount": 56.36,
        "saleType": "Exempt goods",
        "sroItemSerialNo": "100"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-04-21",
    "sellerBusinessName": "Company 7",
    "sellerNTNCNIC": "8885801",
    "sellerProvince": "Sindh",
    "buyerNTNCNIC": "3710505701479",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "sellerAddress": "Karachi",
    "scenarioId": "SN007",
    "buyerRegistrationType": "Unregistered",
    "invoiceRefNo": "0",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "test",
        "rate": "0%",
        "uoM": "Numbers, pieces, units",
        "quantity": 100,
        "totalValues": 0,
        "valueSalesExcludingST": 100,
        "salesTaxApplicable": 0,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "327(I)/2008",
        "fixedNotifiedValueOrRetailPrice": 0.00,
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Goods at zero-rate",
        "sroItemSerialNo": "1"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-04-21",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 7",
    "sellerProvince": "Sindh",
    "buyerNTNCNIC": "3710505701479",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "sellerAddress": "Karachi",
    "invoiceRefNo": "0",
    "scenarioId": "SN008",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "test",
        "rate": "18%",
        "uoM": "Numbers, pieces, units",
        "quantity": 100,
        "totalValues": 145,
        "valueSalesExcludingST": 0,
        "fixedNotifiedValueOrRetailPrice": 1000,
        "salesTaxApplicable": 180,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "3rd Schedule Goods",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-15",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "2046004",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "",
    "scenarioId": "SN009",
    "buyerRegistrationType": "Registered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "test",
        "rate": "18%",
        "uoM": "Numbers, pieces, units",
        "quantity": 0,
        "totalValues": 2500,
        "valueSalesExcludingST": 2500,
        "fixedNotifiedValueOrRetailPrice": 0.00,
        "salesTaxApplicable": 450,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Cotton ginners",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-15",
    "sellerBusinessName": "Company 8",
    "sellerNTNCNIC": "8885801",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "SI-20250515-001",
    "scenarioId": "SN010",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "test",
        "rate": "17%",
        "uoM": "Numbers, pieces, units",
        "quantity": 1000,
        "totalValues": 0,
        "valueSalesExcludingST": 100,
        "fixedNotifiedValueOrRetailPrice": 0.00,
        "salesTaxApplicable": 17,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Telecommunication services",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-15",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "SI-20250515-001",
    "scenarioId": "SN012",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "1.43%",
        "uoM": "Numbers, pieces, units",
        "quantity": 123,
        "totalValues": 132,
        "valueSalesExcludingST": 100,
        "fixedNotifiedValueOrRetailPrice": 0.00,
        "salesTaxApplicable": 1.43,
        "salesTaxWithheldAtSource": 2,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "1450(I)/2021",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Petroleum Products",
        "sroItemSerialNo": "4"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-15",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "SI-20250515-001",
    "scenarioId": "SN013",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "5%",
        "uoM": "Numbers, pieces, units",
        "quantity": 123,
        "totalValues": 212,
        "valueSalesExcludingST": 1000,
        "fixedNotifiedValueOrRetailPrice": 0.00,
        "salesTaxApplicable": 50,
        "salesTaxWithheldAtSource": 11,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "1450(I)/2021",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Electricity Supply to Retailers",
        "sroItemSerialNo": "4"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-15",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "SI-20250515-001",
    "scenarioId": "SN014",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "18%",
        "uoM": "Numbers, pieces, units",
        "quantity": 123,
        "totalValues": 0,
        "valueSalesExcludingST": 1000,
        "salesTaxApplicable": 180,
        "salesTaxWithheldAtSource": 0,
        "fixedNotifiedValueOrRetailPrice": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Gas to CNG stations",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-15",
    "sellerBusinessName": "Company 8",
    "sellerNTNCNIC": "8885801",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "SI-20250515-001",
    "scenarioId": "SN015",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "18%",
        "uoM": "Numbers, pieces, units",
        "quantity": 123,
        "totalValues": 0,
        "valueSalesExcludingST": 1234,
        "salesTaxApplicable": 222.12,
        "salesTaxWithheldAtSource": 0,
        "fixedNotifiedValueOrRetailPrice": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "NINTH SCHEDULE",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Mobile Phones",
        "sroItemSerialNo": "1(A)"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-16",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000078",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "",
    "scenarioId": "SN016",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "test",
        "rate": "5%",
        "uoM": "Numbers, pieces, units",
        "quantity": 1,
        "totalValues": 0,
        "valueSalesExcludingST": 100,
        "salesTaxApplicable": 5,
        "salesTaxWithheldAtSource": 0,
        "fixedNotifiedValueOrRetailPrice": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Processing/Conversion of Goods",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-10",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "7000009",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "",
    "scenarioId": "SN017",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "8%",
        "uoM": "Numbers, pieces, units",
        "quantity": 1,
        "valueSalesExcludingST": 100,
        "fixedNotifiedValueOrRetailPrice": 0,
        "salesTaxApplicable": 8,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "fedPayable": 0,
        "discount": 0,
        "totalValues": 0,
        "saleType": "Goods (FED in ST Mode)",
        "sroScheduleNo": "",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-06-14",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000056",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "SI-20250421-001",
    "scenarioId": "SN018",
    "buyerRegistrationType": "Unregistered",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "8%",
        "uoM": "Numbers, pieces, units",
        "quantity": 20,
        "totalValues": 0,
        "valueSalesExcludingST": 1000,
        "salesTaxApplicable": 80,
        "fixedNotifiedValueOrRetailPrice": 0,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Services (FED in ST Mode)",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-04-21",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "SI-20250421-001",
    "buyerRegistrationType": "Unregistered",
    "scenarioId": "SN019",
    "items": [
      {
        "hsCode": "0101.2900",
        "productDescription": "TEST",
        "rate": "5%",
        "uoM": "Numbers, pieces, units",
        "quantity": 1,
        "totalValues": 0,
        "valueSalesExcludingST": 100,
        "salesTaxApplicable": 5,
        "fixedNotifiedValueOrRetailPrice": 0,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "ICTO TABLE I",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Services",
        "sroItemSerialNo": "1(ii)(ii)(a)"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-04-21",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "buyerRegistrationType": "Unregistered",
    "scenarioId": "SN020",
    "invoiceRefNo": "SI-20250421-001",
    "items": [
      {
        "hsCode": "0101.2900",
        "productDescription": "TEST",
        "rate": "1%",
        "uoM": "Numbers, pieces, units",
        "quantity": 122,
        "totalValues": 0,
        "valueSalesExcludingST": 1000,
        "salesTaxApplicable": 10,
        "salesTaxWithheldAtSource": 0,
        "fixedNotifiedValueOrRetailPrice": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "6th Schd Table III",
        "fedPayable": 0,
        "discount": 0,
        "saleType": "Electric Vehicle",
        "sroItemSerialNo": "20"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-04-21",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "SI-20250421-001",
    "buyerRegistrationType": "Unregistered",
    "scenarioId": "SN021",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "Rs.3 per unit",
        "uoM": "Numbers, pieces, units",
        "quantity": 12,
        "valueSalesExcludingST": 123,
        "salesTaxApplicable": 36,
        "fixedNotifiedValueOrRetailPrice": 3,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "totalValues": 0,
        "saleType": "Cement /Concrete Block",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-04-21",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "buyerRegistrationType": "Unregistered",
    "scenarioId": "SN022",
    "invoiceRefNo": "SI-20250421-001",
    "items": [
      {
        "hsCode": "3104.2000",
        "productDescription": "TEST",
        "rate": "18% + Rs.60/kg",
        "uoM": "KG",
        "quantity": 1,
        "valueSalesExcludingST": 100,
        "fixedNotifiedValueOrRetailPrice": 60,
        "salesTaxApplicable": 78,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "EIGHTH SCHEDULE Table 1",
        "fedPayable": 0,
        "discount": 0,
        "totalValues": 0,
        "saleType": "Potassium Chlorate",
        "sroItemSerialNo": "56"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-04-21",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "buyerRegistrationType": "Unregistered",
    "scenarioId": "SN023",
    "invoiceRefNo": "SI-20250421-001",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "Rs.200/unit",
        "uoM": "Numbers, pieces, units",
        "quantity": 123,
        "valueSalesExcludingST": 234,
        "fixedNotifiedValueOrRetailPrice": 200,
        "salesTaxApplicable": 24600,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "581(1)/2024",
        "fedPayable": 0,
        "discount": 0,
        "totalValues": 0,
        "saleType": "CNG Sales",
        "sroItemSerialNo": "Region-I"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-04-21",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "buyerRegistrationType": "Unregistered",
    "scenarioId": "SN024",
    "invoiceRefNo": "SI-20250421-001",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "25%",
        "uoM": "Numbers, pieces, units",
        "quantity": 123,
        "valueSalesExcludingST": 1000,
        "fixedNotifiedValueOrRetailPrice": 0,
        "salesTaxApplicable": 250,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "297(I)/2023-Table-I",
        "fedPayable": 0,
        "discount": 0,
        "totalValues": 0,
        "saleType": "Goods as per SRO.297(I)/2023",
        "sroItemSerialNo": "12"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-16",
    "sellerNTNCNIC": "8885801",
    "sellerBusinessName": "Company 8",
    "sellerAddress": "Karachi",
    "sellerProvince": "Sindh",
    "buyerNTNCNIC": "1000000000078",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "buyerRegistrationType": "Unregistered",
    "invoiceRefNo": "",
    "scenarioId": "SN025",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "0%",
        "uoM": "Numbers, pieces, units",
        "quantity": 1,
        "valueSalesExcludingST": 100,
        "fixedNotifiedValueOrRetailPrice": 0,
        "salesTaxApplicable": 0,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "EIGHTH SCHEDULE Table 1",
        "fedPayable": 0,
        "discount": 0,
        "totalValues": 0,
        "saleType": "Non-Adjustable Supplies",
        "sroItemSerialNo": "81"
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-16",
    "sellerNTNCNIC": "7000008",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000078",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "buyerRegistrationType": "Registered",
    "scenarioId": "SN026",
    "invoiceRefNo": "SI-20250421-001",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "18%",
        "uoM": "Numbers, pieces, units",
        "quantity": 123,
        "valueSalesExcludingST": 1000,
        "fixedNotifiedValueOrRetailPrice": 0,
        "salesTaxApplicable": 180,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "totalValues": 0,
        "saleType": "Goods at standard rate (default)",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-10",
    "sellerNTNCNIC": "7000008",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "7000006",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "buyerRegistrationType": "Registered",
    "invoiceRefNo": "",
    "scenarioId": "SN027",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "test",
        "rate": "18%",
        "uoM": "Numbers, pieces, units",
        "quantity": 1,
        "valueSalesExcludingST": 0,
        "fixedNotifiedValueOrRetailPrice": 100,
        "salesTaxApplicable": 18,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "",
        "fedPayable": 0,
        "discount": 0,
        "totalValues": 0,
        "saleType": "3rd Schedule Goods",
        "sroItemSerialNo": ""
      }
    ]
  },
  {
    "invoiceType": "Sale Invoice",
    "invoiceDate": "2025-05-16",
    "sellerNTNCNIC": "7000008",
    "sellerBusinessName": "Company 8",
    "sellerProvince": "Sindh",
    "sellerAddress": "Karachi",
    "buyerNTNCNIC": "1000000000000",
    "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
    "buyerProvince": "Sindh",
    "buyerAddress": "Karachi",
    "invoiceRefNo": "",
    "buyerRegistrationType": "Registered",
    "scenarioId": "SN028",
    "items": [
      {
        "hsCode": "0101.2100",
        "productDescription": "TEST",
        "rate": "1%",
        "uoM": "Numbers, pieces, units",
        "quantity": 1,
        "valueSalesExcludingST": 99.01,
        "fixedNotifiedValueOrRetailPrice": 100,
        "salesTaxApplicable": 0.99,
        "salesTaxWithheldAtSource": 0,
        "extraTax": 0,
        "furtherTax": 0,
        "sroScheduleNo": "EIGHTH SCHEDULE Table 1",
        "fedPayable": 0,
        "discount": 0,
        "totalValues": 100,
        "saleType": "Goods at Reduced Rate",
        "sroItemSerialNo": "70"
      }
    ]
  }
];

async function main() {
  console.log('Seeding scenario test data...');
  for (const scenario of scenarios) {
    // 1. Use Existing Tenant "Trade Inn"
    const TARGET_TENANT_ID = 'cmr9dlxcz0000ji04qm0k6ye8';
    const TARGET_CREATOR_ID = 'cmr9dlxlp0002ji04qc7z3bnh';

    let tenant = await prisma.tenant.findUnique({
      where: { id: TARGET_TENANT_ID }
    });
    
    if (!tenant) {
      console.log('Error: Trade Inn tenant not found!');
      return;
    }

    // 2. Ensure Client exists
    const existingClients = await prisma.client.findMany({
      where: {
        tenantId: tenant.id,
        buyerNTNCNIC: scenario.buyerNTNCNIC
      }
    });

    let client = existingClients.length > 0 ? existingClients[0] : null;

    if (!client && scenario.buyerNTNCNIC) {
      client = await prisma.client.create({
        data: {
          tenantId: tenant.id,
          buyerNTNCNIC: scenario.buyerNTNCNIC,
          buyerBusinessName: scenario.buyerBusinessName || 'Dummy Client',
          buyerProvince: scenario.buyerProvince || 'Sindh',
          buyerAddress: scenario.buyerAddress || 'Dummy Address',
          buyerRegistrationType: scenario.buyerRegistrationType || 'Unregistered'
        }
      });
      tracker.clientIds.push(client.id);
      console.log(`Created client: ${client.buyerBusinessName} for Tenant ${tenant.ntnCnic}`);
    }

    // 3. Ensure Items (Stock) exist
    if (scenario.items && scenario.items.length > 0) {
      for (const it of scenario.items) {
        const itemCode = it.hsCode + '-' + (it.productDescription || 'item');
        
        const existingItem = await prisma.item.findUnique({
          where: {
            tenantId_itemCode: {
              tenantId: tenant.id,
              itemCode: itemCode
            }
          }
        });

        if (!existingItem) {
          const item = await prisma.item.create({
            data: {
              tenantId: tenant.id,
              itemCode: itemCode,
              hsCode: it.hsCode || '0000.0000',
              productDescription: it.productDescription || 'Dummy Product',
              rate: it.rate || '18%',
              uoM: it.uoM || 'Numbers, pieces, units',
              unitPrice: (it.valueSalesExcludingST > 0 && it.quantity > 0) ? (it.valueSalesExcludingST / it.quantity) : 100,
              fixedNotifiedValueOrRetailPrice: it.fixedNotifiedValueOrRetailPrice || 0,
              saleType: it.saleType || 'Goods at standard rate (default)',
              sroScheduleNo: it.sroScheduleNo || '',
              sroItemSerialNo: it.sroItemSerialNo || ''
            }
          });
          tracker.itemIds.push(item.id);
          console.log(`Created item: ${it.hsCode} - ${it.productDescription} for Tenant ${tenant.ntnCnic}`);

          // Also create dummy stock for this item so it doesn't fail validation
          const d = new Date();
          const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          
          let rateValue = parseFloat(it.rate) || 18;
          if (isNaN(rateValue)) rateValue = 18;

          const stock = await prisma.stockRegister.upsert({
            where: {
              tenantId_itemCode_monthYear: {
                tenantId: tenant.id,
                itemCode: itemCode,
                monthYear: monthYear
              }
            },
            update: {
              purchasedQty: { increment: 100000 },
              purchasedVal: { increment: 10000000 }
            },
            create: {
              tenantId: tenant.id,
              itemCode: itemCode,
              hsCode: it.hsCode || '0000.0000',
              uoM: it.uoM || 'Numbers, pieces, units',
              salesTaxRate: rateValue,
              monthYear: monthYear,
              openingQty: 100000,
              openingVal: 10000000,
              purchasedQty: 0,
              purchasedVal: 0
            }
          });
          tracker.stockRegisterIds.push(stock.id);
          console.log(`Added 100,000 dummy stock for item ${itemCode}`);
        }
      }
    }

    // 4. Create the actual Invoice for the scenario
    let invoiceDate = new Date();
    if (scenario.invoiceDate) {
      invoiceDate = new Date(scenario.invoiceDate);
      if (isNaN(invoiceDate.getTime())) {
        invoiceDate = new Date();
      }
    }

    const invoice = await prisma.invoice.create({
      data: {
        tenantId: tenant.id,
        clientId: client?.id || null,
        creatorId: TARGET_CREATOR_ID,
        invoiceType: scenario.invoiceType || 'Sale Invoice',
        invoiceDate: invoiceDate,
        invoiceRefNo: scenario.invoiceRefNo || scenario.scenarioId,
        status: 'DRAFT',
        items: {
          create: (scenario.items || []).map(it => {
             const itemCode = it.hsCode + '-' + (it.productDescription || 'item');
             return {
                itemCode: itemCode,
                hsCode: it.hsCode || '0000.0000',
                productDescription: it.productDescription || 'test',
                rate: it.rate || '18%',
                uoM: it.uoM || 'Numbers, pieces, units',
                quantity: parseFloat(it.quantity) || 1,
                totalValues: parseFloat(it.totalValues) || 0,
                valueSalesExcludingST: parseFloat(it.valueSalesExcludingST) || 0,
                fixedNotifiedValueOrRetailPrice: parseFloat(it.fixedNotifiedValueOrRetailPrice) || 0,
                salesTaxApplicable: parseFloat(it.salesTaxApplicable) || 0,
                salesTaxWithheldAtSource: parseFloat(it.salesTaxWithheldAtSource) || 0,
                extraTax: parseFloat(it.extraTax) || 0,
                furtherTax: parseFloat(it.furtherTax) || 0,
                sroScheduleNo: it.sroScheduleNo || '',
                fedPayable: parseFloat(it.fedPayable) || 0,
                discount: parseFloat(it.discount) || 0,
                saleType: it.saleType || 'Goods at standard rate (default)',
                sroItemSerialNo: it.sroItemSerialNo || ''
             }
          })
        }
      }
    });
    
    tracker.invoiceIds.push(invoice.id);
    console.log(`Created Invoice for Scenario ${scenario.scenarioId} (${invoice.id})`);
  }
  
  // Save tracker to file
  const trackerPath = path.join(__dirname, '.sandbox-seed-tracker.json');
  fs.writeFileSync(trackerPath, JSON.stringify(tracker, null, 2));
  console.log(`Saved tracker to ${trackerPath}`);
  
  console.log('Finished seeding test data!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
