import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant } from '../../actions';
import NewClientForm from './NewClientForm';

export default async function NewClientPage() {
  const tenant = await getCurrentTenant();
  const businessName = tenant?.businessName || 'Get Legal Solution';

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link href="/clients" className="inline-flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Onboard New Client</h1>
          <p className="text-neutral-400">Register a new buyer profile compliant with FBR standards.</p>
        </header>

        {tenant && <NewClientForm tenantId={tenant.id} />}
      </main>
    </div>
  );
}
