import React from 'react';
import { prisma } from '../../../../lib/prisma';
import { adminSaveFbrCredentials, adminToggleFbrIntegration, adminToggleVisibility, adminTestFbrConnection } from '../../../actions/fbr';
import { Webhook, CheckCircle2, XCircle, Eye, EyeOff, Activity, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function FbrIntegrationDetail({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const t = await prisma.tenant.findUnique({
    where: { id: resolvedParams.id },
    include: { fbrIntegration: true }
  });

  if (!t) {
    return <div className="text-white p-8">Tenant not found</div>;
  }

  const integration = t.fbrIntegration;

  return (
    <div className="text-white font-sans p-8">
      <header className="mb-8">
        <Link href="/admin/fbr-integration" className="text-emerald-500 hover:text-emerald-400 flex items-center gap-2 mb-4 text-sm font-bold w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to FBR Integrations
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
          <Webhook className="w-7 h-7 text-emerald-500" />
          FBR Integration: {t.businessName}
        </h1>
        <p className="text-neutral-400">Configure PRAL credentials and toggle active automated transmission for this company.</p>
      </header>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-white">{t.businessName}</h2>
            <p className="text-neutral-400 font-mono text-sm">NTN: {t.ntnCnic}</p>
          </div>
          <div className="flex gap-4 items-center">
            {integration ? (
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${integration.environment === 'PRODUCTION' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {integration.environment}
                </span>
                {integration.lastSync && (
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Last Sync: {new Date(integration.lastSync).toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full font-bold">UNCONFIGURED</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Configuration Form */}
          <div>
            <h3 className="font-bold text-neutral-300 mb-4">API Credentials</h3>
            <form action={adminSaveFbrCredentials} className="space-y-4">
              <input type="hidden" name="tenantId" value={t.id} />
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">POS ID</label>
                <input type="text" name="posId" defaultValue={integration?.posId || ''} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-sm focus:border-emerald-500 outline-none font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Client ID</label>
                <input type="text" name="clientId" defaultValue={integration?.clientId || ''} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-sm focus:border-emerald-500 outline-none font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Client Secret</label>
                <input type="password" name="clientSecret" defaultValue={integration?.clientSecret || ''} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-sm focus:border-emerald-500 outline-none font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Environment</label>
                <select name="environment" defaultValue={integration?.environment || 'SANDBOX'} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-sm focus:border-emerald-500 outline-none text-white">
                  <option value="SANDBOX">Sandbox</option>
                  <option value="PRODUCTION">Production</option>
                </select>
              </div>
              <button type="submit" className="bg-emerald-500 text-neutral-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-400 transition-colors w-full">
                Save Configuration
              </button>
            </form>
          </div>

          {/* Integration Controls */}
          <div className="bg-neutral-950/50 rounded-xl p-6 border border-neutral-800">
            <h3 className="font-bold text-neutral-300 mb-6">Integration Controls</h3>
            
            {integration ? (
              <div className="space-y-6">
                {/* Active Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-white">Active Transmission</p>
                    <p className="text-xs text-neutral-500">Route invoices to FBR API automatically</p>
                  </div>
                  <form action={async () => {
                    'use server';
                    await adminToggleFbrIntegration(t.id, !integration.isActive);
                  }}>
                    <button type="submit" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${integration.isActive ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${integration.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </form>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-white">Tenant Visibility</p>
                    <p className="text-xs text-neutral-500">Allow Tenant Admin to view credentials</p>
                  </div>
                  <form action={async () => {
                    'use server';
                    await adminToggleVisibility(t.id, !integration.isVisibleToTenant);
                  }}>
                    <button type="submit" className="flex items-center gap-2 text-sm font-medium bg-neutral-800 px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition-colors">
                      {integration.isVisibleToTenant ? (
                        <><Eye className="w-4 h-4 text-emerald-500"/> Visible</>
                      ) : (
                        <><EyeOff className="w-4 h-4 text-neutral-500"/> Hidden</>
                      )}
                    </button>
                  </form>
                </div>

                <hr className="border-neutral-800" />

                {/* Test Connection Button */}
                <form action={async () => {
                  'use server';
                  await adminTestFbrConnection(t.id);
                }}>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-neutral-800 border border-neutral-700 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-neutral-700 transition-colors">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Test FBR Connection
                  </button>
                </form>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <XCircle className="w-8 h-8 text-neutral-600 mb-2" />
                <p className="text-sm text-neutral-500">Configure and save credentials to unlock integration controls.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
