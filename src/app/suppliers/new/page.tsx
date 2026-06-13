import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant } from '../../actions';
import NewSupplierForm from './NewSupplierForm';

export default async function NewSupplierPage() {
  const tenant = await getCurrentTenant();
  const businessName = tenant?.businessName || 'Get Legal Solution';

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/suppliers" className="inline-flex items-center gap-2 text-neutral-400 hover:text-emerald-400 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Suppliers
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Register New Supplier</h1>
          <p className="text-neutral-400">Add a new vendor or supplier profile to your system.</p>
        </div>
        <NewSupplierForm tenantId={tenant?.id || ''} />
      </main>
    </div>
  );
}
