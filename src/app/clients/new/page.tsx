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
      <nav className="border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-neutral-950" />
            </div>
            <span className="font-bold text-lg tracking-tight">{businessName} <span className="text-emerald-500">DI</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-neutral-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link href="/clients" className="text-white">Clients</Link>
            <Link href="/items" className="hover:text-emerald-400 transition-colors">Items</Link>
            <Link href="/vouchers" className="hover:text-emerald-400 transition-colors">Vouchers</Link>
            <Link href="/support" className="hover:text-emerald-400 transition-colors">Settings</Link>
            <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 ml-4"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
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
