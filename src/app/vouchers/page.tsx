import React from 'react';
import { Receipt, Plus, Search, CheckCircle, Clock, XCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant, getInvoices, postDraftToFBR } from '../actions';

export default async function VouchersPage() {
  const tenant = await getCurrentTenant();
  const invoices = tenant ? await getInvoices(tenant.id) : [];
  const businessName = tenant?.businessName || 'Get Legal Solution';


  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Vouchers & FBR Invoices</h1>
            <p className="text-neutral-400">Generate sale and purchase vouchers and finalize them into secure FBR Digital Invoices.</p>
          </div>
          <Link href="/vouchers/new" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-5 py-2.5 rounded-xl font-bold transition-all transform active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Add New Voucher
          </Link>
        </header>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-3" />
              <input 
                type="text" 
                placeholder="Search vouchers by ID or Client name..." 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="uppercase tracking-wider border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="px-4 py-4 font-medium">Voucher ID</th>
                  <th className="px-4 py-4 font-medium">Client / Supplier</th>
                  <th className="px-4 py-4 font-medium">Type</th>
                  <th className="px-4 py-4 font-medium">Total Amount</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {invoices.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-neutral-500">No vouchers generated yet.</td></tr>
                )}
                {invoices.map((v: any) => (
                  <tr key={v.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center border border-neutral-700">
                          <Receipt className="w-4 h-4 text-neutral-400" />
                        </div>
                        <span className="font-semibold text-white">
                          {v.voucherNumber && v.voucherNumber > 0 
                            ? `VOU-${String(v.voucherNumber).padStart(4, '0')}` 
                            : `VOU-${v.id.substring(1,7).toUpperCase()}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-neutral-300">
                      {v.client?.buyerBusinessName || v.supplier?.sellerBusinessName || 'N/A'}
                      {v.supplier && <span className="ml-2 text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Vendor</span>}
                    </td>
                    <td className="px-4 py-4 text-neutral-400">{v.invoiceType}</td>
                    <td className="px-4 py-4 font-mono font-medium text-emerald-500">-</td>
                    <td className="px-4 py-4 text-neutral-400">{v.invoiceDate.toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      {v.status === 'VALID' && <span className="flex items-center gap-1.5 text-emerald-500 font-medium"><CheckCircle className="w-4 h-4" /> Valid</span>}
                      {(v.status === 'PENDING_FBR' || v.status === 'DRAFT') && <span className="flex items-center gap-1.5 text-amber-500 font-medium"><Clock className="w-4 h-4" /> {v.status}</span>}
                      {(v.status === 'INVALID' || v.status === 'FAILED_CONNECTION') && <span className="flex items-center gap-1.5 text-rose-500 font-medium"><XCircle className="w-4 h-4" /> {v.status}</span>}
                    </td>
                    <td className="px-4 py-4 text-right space-x-3">
                      {v.status === 'DRAFT' && (
                        <form action={postDraftToFBR.bind(null, v.id)} className="inline">
                          <button type="submit" className="text-amber-500 font-medium hover:text-amber-400 mr-3">Post to FBR</button>
                        </form>
                      )}
                      <Link href={`/vouchers/${v.id}`} className="text-emerald-500 font-medium hover:underline">View PDF</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
