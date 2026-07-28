import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant, getClients, getItems, getSuppliers, getInvoiceById } from '../../../actions';
import NewVoucherForm from '../../new/NewVoucherForm';
import { notFound } from 'next/navigation';

export default async function EditVoucherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tenant = await getCurrentTenant();
  if (!tenant) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-sans flex items-center justify-center">
        <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-400">
          You must be logged in to edit a voucher.
        </div>
      </div>
    );
  }

  const invoice = await getInvoiceById(id);
  if (!invoice || invoice.tenantId !== tenant.id) {
    notFound();
  }

  if (
    invoice.status !== 'DRAFT' && 
    invoice.status !== 'PENDING_APPROVAL' && 
    invoice.status !== 'INVALID' &&
    invoice.status !== 'FAILED_CONNECTION' &&
    invoice.invoiceType !== 'Purchase Invoice'
  ) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-sans flex items-center justify-center">
        <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-2xl text-rose-500">
          This voucher has been finalized and sent to FBR and cannot be edited.
        </div>
      </div>
    );
  }

  const clients = await getClients(tenant.id);
  const suppliers = await getSuppliers(tenant.id);
  const items = await getItems(tenant.id);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link href="/vouchers" className="inline-flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vouchers
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Edit Voucher</h1>
          <p className="text-neutral-400">Update the details of your voucher.</p>
        </header>

        <NewVoucherForm 
          clients={clients} 
          suppliers={suppliers} 
          items={items} 
          tenantId={tenant.id} 
          initialData={invoice} 
        />
      </main>
    </div>
  );
}
