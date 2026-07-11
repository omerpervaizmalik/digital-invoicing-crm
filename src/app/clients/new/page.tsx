import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant, getClient } from '../../actions';
import NewClientForm from './NewClientForm';

export default async function NewClientPage({ searchParams }: { searchParams: Promise<{ clone?: string }> }) {
  const tenant = await getCurrentTenant();
  const resolvedParams = await searchParams;
  const cloneClient = resolvedParams?.clone ? await getClient(resolvedParams.clone) : null;
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

        {tenant ? <NewClientForm key={cloneClient?.id || 'new'} tenantId={tenant.id} initialData={cloneClient} /> : (
          <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-400">
            You must be logged in as a tenant or impersonating a tenant to add a client.
          </div>
        )}
      </main>
    </div>
  );
}
