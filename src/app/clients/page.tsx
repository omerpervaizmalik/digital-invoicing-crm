import React from 'react';
import { Users, Plus, Search, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant, getClients } from '../actions';

export default async function ClientsPage() {
  const tenant = await getCurrentTenant();
  const clients = tenant ? await getClients(tenant.id) : [];
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

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Client Management</h1>
            <p className="text-neutral-400">Manage buyer profiles and their FBR registration status.</p>
          </div>
          <Link href="/clients/new" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-5 py-2.5 rounded-xl font-bold transition-all transform active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Add New Client
          </Link>
        </header>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-3" />
              <input 
                type="text" 
                placeholder="Search clients by name or NTN/CNIC..." 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="uppercase tracking-wider border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="px-4 py-4 font-medium">Business Name</th>
                  <th className="px-4 py-4 font-medium">NTN / CNIC</th>
                  <th className="px-4 py-4 font-medium">Province</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {clients.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-neutral-500">No clients registered yet.</td></tr>
                )}
                {clients.map((client: any) => (
                  <tr key={client.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                          <Users className="w-4 h-4 text-neutral-400" />
                        </div>
                        <span className="font-semibold text-white">{client.buyerBusinessName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-emerald-500">{client.buyerNTNCNIC}</td>
                    <td className="px-4 py-4 text-neutral-400">{client.buyerProvince}</td>
                    <td className="px-4 py-4">
                      {client.buyerRegistrationType === 'Registered' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Registered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
                          <AlertCircle className="w-3.5 h-3.5" /> Unregistered
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-emerald-500 font-medium hover:underline">Edit</button>
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
