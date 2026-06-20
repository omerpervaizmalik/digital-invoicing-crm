import { ShieldCheck, TrendingUp, Users, Package, Receipt, ArrowRight, Activity, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getCurrentTenant, getClients, getItems, getInvoices, getCurrentUser } from './actions';
import { redirect } from 'next/navigation';

import Image from 'next/image';

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (user?.role === 'ULTIMATE_ADMIN') {
    redirect('/admin');
  }

  const tenant = await getCurrentTenant();
  const clients = tenant ? await getClients(tenant.id) : [];
  const items = tenant ? await getItems(tenant.id) : [];
  const invoices = tenant ? await getInvoices(tenant.id) : [];
  
  const businessName = tenant?.businessName || 'Get Legal Solution';

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl overflow-hidden relative shadow-lg shadow-emerald-500/20 bg-neutral-900 border border-neutral-800 shrink-0 hidden md:block">
              <img src="/logo.png" alt="Get Legal Solution Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">{businessName} Invoice Management</h1>
              <p className="text-neutral-400 text-sm md:text-base">Monitor your real-time FBR digital invoicing metrics and system health.</p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-400">Registered Buyers</h3>
              <Users className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-mono font-bold">{clients.length}</p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-400">Item Catalog</h3>
              <Package className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-mono font-bold">{items.length}</p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-400">Total Invoices</h3>
              <Receipt className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-mono font-bold">{invoices.length}</p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-400">Success Rate</h3>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-mono font-bold">100%</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Col - Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight">Recent FBR Transmissions</h2>
                <button className="text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-4">
                <Link href="/stock-register" className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-emerald-500">FBR Stock Register</h3>
                      <p className="text-sm text-neutral-400">View real-time inventory compliance.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </Link>

                {[
                  { id: "INV-2026-004", client: "TechCorp Ltd", status: "VALID", time: "2 mins ago" },
                  { id: "INV-2026-003", client: "Alpha Logistics", status: "VALID", time: "45 mins ago" },
                  { id: "INV-2026-002", client: "Beta Manufacturing", status: "PENDING", time: "1 hour ago" },
                  { id: "INV-2026-001", client: "Omega Traders", status: "FAILED_CONNECTION", time: "2 hours ago" },
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-neutral-950 border border-neutral-800/50 hover:bg-neutral-800/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center border border-neutral-700">
                        <FileText className="w-5 h-5 text-neutral-400" />
                      </div>
                      <div>
                        <p className="font-semibold">{inv.id}</p>
                        <p className="text-sm text-neutral-400">{inv.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                        inv.status === 'VALID' ? 'bg-emerald-500/10 text-emerald-500' :
                        inv.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {inv.status}
                      </span>
                      <span className="text-sm text-neutral-500 w-24 text-right">{inv.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col - Quick Actions */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-neutral-900 border border-emerald-900/50">
              <h2 className="text-xl font-bold tracking-tight mb-2">Sandbox Automator</h2>
              <p className="text-sm text-neutral-400 mb-6">Run standard scenario arrays against the PRAL test gateway to extract production tokens.</p>
              <button className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-all transform active:scale-[0.98]">
                Execute Test Scenarios
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
              <h2 className="text-xl font-bold tracking-tight mb-4">Failover Queue</h2>
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 flex items-start gap-4 mb-4">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-rose-500 mb-1">1 Offline Invoice</h3>
                  <p className="text-sm text-rose-200/70">Connection dropped during FBR payload transmission. Awaiting manual retry.</p>
                </div>
              </div>
              <button className="w-full py-3 px-4 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-white font-semibold transition-all">
                Review & Resubmit
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
