import React from 'react';
import { prisma } from '../../../lib/prisma';
import { adminSaveFbrCredentials, adminToggleFbrIntegration, adminToggleVisibility, adminTestFbrConnection } from '../../actions/fbr';
import { Webhook, CheckCircle2, XCircle, Eye, EyeOff, Activity } from 'lucide-react';

export default async function FbrIntegrationCenter() {
  const tenants = await prisma.tenant.findMany({
    include: { fbrIntegration: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="text-white font-sans p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <Webhook className="w-7 h-7 text-emerald-500" />
            FBR Integration Center
          </h1>
          <p className="text-neutral-400">Configure PRAL credentials and toggle active automated transmission per company.</p>
        </div>
      </header>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400">
            <tr>
              <th className="py-4 px-6 font-medium">Company Name</th>
              <th className="py-4 px-6 font-medium">NTN</th>
              <th className="py-4 px-6 font-medium text-center">Status</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {tenants.map(t => {
              const integration = t.fbrIntegration;
              return (
                <tr key={t.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="py-4 px-6 font-bold">{t.businessName}</td>
                  <td className="py-4 px-6 font-mono text-neutral-400">{t.ntnCnic}</td>
                  <td className="py-4 px-6 text-center">
                    {integration ? (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${integration.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-500/10 text-neutral-400'}`}>
                        {integration.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    ) : (
                      <span className="text-xs bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full font-bold">UNCONFIGURED</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <a href={`/admin/fbr-integration/${t.id}`} className="text-emerald-500 font-bold hover:underline">
                      Configure Integration
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
