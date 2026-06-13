import React from 'react';
import { ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getInvoiceById, postDraftToFBR } from '../../actions';
import { notFound } from 'next/navigation';
import ClientPrintButton from './ClientPrintButton';
import QRCode from 'qrcode';

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

  // Formatting
  const taxPeriod = new Date(invoice.invoiceDate).toISOString().slice(0, 7).replace('-', '');
  const displayStatus = invoice.fbrInvoiceNumber ? 'Digitized' : invoice.status;
  const qrDataUri = await QRCode.toDataURL(invoice.fbrInvoiceNumber || invoice.id, { errorCorrectionLevel: 'M', width: 120 });

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link href="/vouchers" className="inline-flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vouchers
          </Link>
          <div className="flex gap-4 items-center">
            {invoice.status === 'DRAFT' && (
              <form action={postDraftToFBR.bind(null, invoice.id)}>
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg">
                  Submit to FBR
                </button>
              </form>
            )}
            <ClientPrintButton />
          </div>
        </div>

        {/* Invoice Document (Printable Area) */}
        <div className="bg-white text-neutral-900 p-12 rounded-2xl shadow-xl print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-neutral-200 pb-8 mb-8">
            <div className="flex gap-4 items-center">
              <div className="bg-[#00478f] text-white p-3 rounded-md text-center border-t-4 border-green-500 shadow-md">
                <div className="font-bold tracking-widest text-sm text-green-400">FBR</div>
                <div className="font-black text-2xl tracking-tighter leading-none my-1">DIGITAL</div>
                <div className="text-[0.6rem] font-bold tracking-tight">INVOICING SYSTEM</div>
              </div>
              <img src={qrDataUri} alt="FBR QR Code" className="w-24 h-24 mix-blend-multiply" />
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-black text-neutral-900 mb-1">{invoice.invoiceType.toUpperCase()}</h1>
              <h2 className="text-xl font-bold text-emerald-600 mb-1">{invoice.tenant.businessName}</h2>
              <p className="text-neutral-600 text-sm">{invoice.tenant.address}</p>
              <p className="text-neutral-600 text-sm">{invoice.tenant.province}, Pakistan</p>
              <p className="text-neutral-600 text-sm mt-1 font-medium">NTN/CNIC: <span className="font-bold text-neutral-900">{invoice.tenant.ntnCnic}</span></p>
            </div>
          </div>

          {/* Invoice Summary & Bill To */}
          <div className="grid grid-cols-2 gap-12 mb-8">
            <div>
              <h3 className="text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">
                {invoice.supplier ? 'Supplier Information' : 'Buyer Information'}
              </h3>
              <p className="text-lg font-bold text-neutral-800">
                {invoice.client?.buyerBusinessName || invoice.supplier?.sellerBusinessName}
              </p>
              <p className="text-neutral-600 text-sm">
                {invoice.client?.buyerAddress || invoice.supplier?.sellerAddress}
              </p>
              <p className="text-neutral-600 text-sm">
                {invoice.client?.buyerProvince || invoice.supplier?.sellerProvince}
              </p>
              <p className="text-neutral-600 text-sm mt-1 font-medium">Registration No.: <span className="font-bold text-neutral-900">
                {invoice.client?.buyerNTNCNIC || invoice.supplier?.sellerNTNCNIC || 'Unregistered'}
              </span></p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-400 mb-2 uppercase tracking-wider">Invoice Summary</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-neutral-500">FBR Invoice No.:</span>
                <span className="font-mono font-medium text-neutral-900 text-right">{invoice.fbrInvoiceNumber || '-'}</span>
                
                <span className="text-neutral-500">Invoice Date:</span>
                <span className="font-medium text-neutral-900 text-right">{invoice.invoiceDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                
                <span className="text-neutral-500">Tax Period:</span>
                <span className="font-medium text-neutral-900 text-right">{taxPeriod}</span>
                
                <span className="text-neutral-500">Status:</span>
                <span className="font-bold text-emerald-600 text-right">{displayStatus}</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-neutral-900 bg-neutral-100 text-xs">
                <th className="py-2 px-2 text-left font-bold text-neutral-900">Sr#</th>
                <th className="py-2 px-2 text-left font-bold text-neutral-900">Product Description</th>
                <th className="py-2 px-2 text-center font-bold text-neutral-900">HS Code</th>
                <th className="py-2 px-2 text-center font-bold text-neutral-900">Quantity</th>
                <th className="py-2 px-2 text-center font-bold text-neutral-900">UOM</th>
                <th className="py-2 px-2 text-right font-bold text-neutral-900">Unit Price (PKR)</th>
                <th className="py-2 px-2 text-right font-bold text-neutral-900">Amount Excl ST (PKR)</th>
                <th className="py-2 px-2 text-right font-bold text-neutral-900">Sales Tax Amount (PKR)</th>
                <th className="py-2 px-2 text-right font-bold text-neutral-900">Further Tax (PKR)</th>
                <th className="py-2 px-2 text-right font-bold text-neutral-900">Total Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-sm">
              {invoice.items.map((item, idx) => {
                const unitPrice = item.quantity > 0 ? (item.valueSalesExcludingST / item.quantity) : 0;
                const rowTotal = item.valueSalesExcludingST + item.salesTaxApplicable + item.extraTax + item.furtherTax;
                return (
                  <tr key={idx}>
                    <td className="py-3 px-2 text-neutral-600 text-center">{idx + 1}</td>
                    <td className="py-3 px-2 text-neutral-800 font-medium">{item.productDescription}</td>
                    <td className="py-3 px-2 text-center text-neutral-600">{item.hsCode}</td>
                    <td className="py-3 px-2 text-center text-neutral-600">{item.quantity}</td>
                    <td className="py-3 px-2 text-center text-neutral-600">{item.uoM}</td>
                    <td className="py-3 px-2 text-right text-neutral-600">{unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right text-neutral-600">{item.valueSalesExcludingST.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right text-neutral-600">{item.salesTaxApplicable.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right text-neutral-600">{item.furtherTax.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right text-neutral-900 font-bold">{rowTotal.toFixed(2)}</td>
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
