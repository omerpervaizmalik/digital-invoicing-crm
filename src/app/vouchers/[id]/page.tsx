import React from 'react';
import { ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getInvoiceById } from '../../actions';
import { notFound } from 'next/navigation';
import ClientPrintButton from './ClientPrintButton';

export default async function InvoiceViewPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  // Calculate totals
  const totalExclTax = invoice.items.reduce((sum, item) => sum + item.valueSalesExcludingST, 0);
  const totalTax = invoice.items.reduce((sum, item) => sum + item.salesTaxApplicable + item.extraTax + item.furtherTax, 0);
  const grandTotal = totalExclTax + totalTax;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      <nav className="border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-neutral-950" />
            </div>
            <span className="font-bold text-lg tracking-tight">Get Legal Solution <span className="text-emerald-500">DI</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-neutral-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link href="/clients" className="hover:text-emerald-400 transition-colors">Clients</Link>
            <Link href="/items" className="hover:text-emerald-400 transition-colors">Items</Link>
            <Link href="/vouchers" className="text-white">Vouchers</Link>
            <Link href="/support" className="hover:text-emerald-400 transition-colors">Settings</Link>
            <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 ml-4"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link href="/vouchers" className="inline-flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vouchers
          </Link>
          <ClientPrintButton />
        </div>

        {/* Invoice Document (Printable Area) */}
        <div className="bg-white text-neutral-900 p-12 rounded-2xl shadow-xl print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-neutral-200 pb-8 mb-8">
            <div>
              <h1 className="text-4xl font-black text-neutral-900 mb-2">TAX INVOICE</h1>
              <p className="text-neutral-500 font-medium">Invoice No: <span className="text-neutral-900">{invoice.id.toUpperCase()}</span></p>
              <p className="text-neutral-500 font-medium">Date: <span className="text-neutral-900">{invoice.invoiceDate.toLocaleDateString()}</span></p>
              <p className="text-neutral-500 font-medium mt-2">Status: <span className="text-amber-600 font-bold">{invoice.status}</span></p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-emerald-600 mb-1">{invoice.tenant.businessName}</h2>
              <p className="text-neutral-600">{invoice.tenant.address}</p>
              <p className="text-neutral-600">{invoice.tenant.province}, Pakistan</p>
              <p className="text-neutral-600 mt-2 font-medium">NTN/CNIC: {invoice.tenant.ntnCnic}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-2 uppercase tracking-wider">Bill To</h3>
            <p className="text-xl font-bold text-neutral-800">{invoice.client.buyerBusinessName}</p>
            <p className="text-neutral-600">{invoice.client.buyerAddress}</p>
            <p className="text-neutral-600">{invoice.client.buyerProvince}</p>
            <p className="text-neutral-600 mt-2 font-medium">NTN/CNIC: {invoice.client.buyerNTNCNIC}</p>
          </div>

          {/* Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-neutral-900">
                <th className="py-3 text-left font-bold text-neutral-900">Description</th>
                <th className="py-3 text-center font-bold text-neutral-900">HS Code</th>
                <th className="py-3 text-center font-bold text-neutral-900">Qty</th>
                <th className="py-3 text-right font-bold text-neutral-900">Unit Price</th>
                <th className="py-3 text-right font-bold text-neutral-900">Tax Rate</th>
                <th className="py-3 text-right font-bold text-neutral-900">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {invoice.items.map((item, idx) => {
                const unitPrice = item.quantity > 0 ? (item.valueSalesExcludingST / item.quantity) : 0;
                const taxSum = item.salesTaxApplicable + item.extraTax + item.furtherTax;
                const rowTotal = item.valueSalesExcludingST + taxSum;
                return (
                  <tr key={idx}>
                    <td className="py-4 text-neutral-800 font-medium">{item.productDescription}</td>
                    <td className="py-4 text-center text-neutral-600 font-mono text-sm">{item.hsCode}</td>
                    <td className="py-4 text-center text-neutral-600">{item.quantity}</td>
                    <td className="py-4 text-right text-neutral-600">Rs {unitPrice.toFixed(2)}</td>
                    <td className="py-4 text-right text-neutral-600">{item.rate}</td>
                    <td className="py-4 text-right text-neutral-900 font-bold">Rs {rowTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary */}
          <div className="flex justify-end border-t-2 border-neutral-200 pt-8">
            <div className="w-1/2">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-600 font-medium">Subtotal (Excl. Tax)</span>
                <span className="text-neutral-900 font-bold">Rs {totalExclTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-neutral-600 font-medium">Total Sales Tax</span>
                <span className="text-neutral-900 font-bold">Rs {totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-neutral-900 pt-4 mt-4">
                <span className="text-2xl font-black text-neutral-900">Grand Total</span>
                <span className="text-2xl font-black text-emerald-600">Rs {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center text-sm text-neutral-500 print:mt-8">
            <p>This is a computer generated invoice and does not require a signature.</p>
            <p className="mt-1">Generated via Get Legal Solution DI.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
