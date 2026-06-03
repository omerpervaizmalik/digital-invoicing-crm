import React from 'react';
import { Package, Plus, Search, Tag, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant, getItems } from '../actions';

export default async function ItemsPage() {
  const tenant = await getCurrentTenant();
  const items = tenant ? await getItems(tenant.id) : [];
  const businessName = tenant?.businessName || 'Get Legal Solution';

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      <nav className="border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-neutral-950" />
            </div>
            <span className="font-bold text-lg tracking-tight">Get Legal Solution <span className="text-emerald-500">DI</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-neutral-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link href="/clients" className="hover:text-emerald-400 transition-colors">Clients</Link>
            <Link href="/items" className="text-white">Items</Link>
            <Link href="/vouchers" className="hover:text-emerald-400 transition-colors">Vouchers</Link>
            <Link href="/support" className="hover:text-emerald-400 transition-colors">Settings</Link>
            <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 ml-4"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Item File Catalog</h1>
            <p className="text-neutral-400">Manage products linked to official FBR HS Codes and Tax Rates.</p>
          </div>
          <Link href="/items/new" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-5 py-2.5 rounded-xl font-bold transition-all transform active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Add New Item
          </Link>
        </header>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-3" />
              <input 
                type="text" 
                placeholder="Search items by description or HS Code..." 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="uppercase tracking-wider border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="px-4 py-4 font-medium">Product Description</th>
                  <th className="px-4 py-4 font-medium">HS Code</th>
                  <th className="px-4 py-4 font-medium">Sales Tax Rate</th>
                  <th className="px-4 py-4 font-medium">Unit of Measure (UOM)</th>
                  <th className="px-4 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {items.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-neutral-500">No items found in catalog.</td></tr>
                )}
                {items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center border border-neutral-700">
                          <Package className="w-4 h-4 text-neutral-400" />
                        </div>
                        <span className="font-semibold text-white truncate max-w-xs">{item.productDescription}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-emerald-500 font-medium">{item.hsCode}</td>
                    <td className="px-4 py-4 text-neutral-300">
                      <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-xs font-bold">{item.rate}</span>
                    </td>
                    <td className="px-4 py-4 text-neutral-400">{item.uoM}</td>
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
