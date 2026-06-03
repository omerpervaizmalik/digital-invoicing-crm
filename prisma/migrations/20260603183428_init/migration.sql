-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessName" TEXT NOT NULL,
    "ntnCnic" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "businessNature" TEXT,
    "sector" TEXT,
    "fbrToken" TEXT,
    "fbrTokenExpiry" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "buyerBusinessName" TEXT NOT NULL,
    "buyerNTNCNIC" TEXT,
    "buyerProvince" TEXT NOT NULL,
    "buyerAddress" TEXT NOT NULL,
    "buyerRegistrationType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "hsCode" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "rate" TEXT NOT NULL,
    "uoM" TEXT NOT NULL,
    "fixedNotifiedValueOrRetailPrice" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Item_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "invoiceType" TEXT NOT NULL,
    "invoiceDate" DATETIME NOT NULL,
    "invoiceRefNo" TEXT,
    "fbrInvoiceNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "validationError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "hsCode" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "rate" TEXT NOT NULL,
    "uoM" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "totalValues" REAL NOT NULL,
    "valueSalesExcludingST" REAL NOT NULL,
    "fixedNotifiedValueOrRetailPrice" REAL NOT NULL,
    "salesTaxApplicable" REAL NOT NULL,
    "salesTaxWithheldAtSource" REAL NOT NULL DEFAULT 0,
    "extraTax" REAL NOT NULL DEFAULT 0,
    "furtherTax" REAL NOT NULL DEFAULT 0,
    "sroScheduleNo" TEXT,
    "fedPayable" REAL NOT NULL DEFAULT 0,
    "discount" REAL NOT NULL DEFAULT 0,
    "saleType" TEXT NOT NULL DEFAULT 'Goods at standard rate (default)',
    "sroItemSerialNo" TEXT,
    CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_ntnCnic_key" ON "Tenant"("ntnCnic");
