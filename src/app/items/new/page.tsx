import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant } from '../../actions';
import NewItemForm from './NewItemForm';

export default async function NewItemPage() {
  const tenant = await getCurrentTenant();
  const businessName = tenant?.businessName || 'Get Legal Solution';

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/items" className="inline-flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create New Item</h1>
          <p className="text-neutral-400">Map an internal product to official FBR APIs parameters.</p>
        </header>

        {tenant && <NewItemForm tenantId={tenant.id} />}
      </main>
    </div>
  );
}
