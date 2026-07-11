import React from 'react';
import { Receipt, Plus, Search, CheckCircle, Clock, XCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant, getInvoices, postDraftToFBR } from '../actions';
import VoucherList from './VoucherList';

export default async function VouchersPage() {
  const tenant = await getCurrentTenant();
  const invoices = tenant ? await getInvoices(tenant.id) : [];
  const businessName = tenant?.businessName || 'Get Legal Solution';


  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
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

        <VoucherList invoices={invoices} />
      </main>
    </div>
  );
}
