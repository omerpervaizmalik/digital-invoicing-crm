import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant, getClients, getItems, getSuppliers } from '../../actions';
import NewVoucherForm from './NewVoucherForm';

export default async function NewVoucherPage() {
  const tenant = await getCurrentTenant();
  const clients = tenant ? await getClients(tenant.id) : [];
  const suppliers = tenant ? await getSuppliers(tenant.id) : [];
  const items = tenant ? await getItems(tenant.id) : [];
  const businessName = tenant?.businessName || 'Get Legal Solution';

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link href="/vouchers" className="inline-flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vouchers
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Add New Voucher</h1>
          <p className="text-neutral-400">Generate a new transaction and post it instantly to the FBR API.</p>
        </header>

        {tenant && <NewVoucherForm clients={clients} suppliers={suppliers} items={items} tenantId={tenant.id} />}
      </main>
    </div>
  );
}
