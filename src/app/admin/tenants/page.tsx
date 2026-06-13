import React from 'react';
import { prisma } from '../../../lib/prisma';
import { Building2 } from 'lucide-react';
import { DeleteButton } from '../components/DeleteButton';

export default async function AdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    include: {
      users: true,
      invoices: true,
      subscription: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="text-white font-sans p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-emerald-500" />
            Company (Tenant) Management
          </h1>
          <p className="text-neutral-400">View and manage all registered companies across the platform.</p>
        </div>
      </header>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-800 text-neutral-400">
            <tr>
              <th className="pb-3 font-medium">Business Name</th>
              <th className="pb-3 font-medium">NTN / CNIC</th>
              <th className="pb-3 font-medium">Profile Status</th>
              <th className="pb-3 font-medium">Users</th>
              <th className="pb-3 font-medium">Plan Tier</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {tenants.map(t => (
              <tr key={t.id}>
                <td className="py-4 font-bold text-white">{t.businessName}</td>
                <td className="py-4 font-mono text-neutral-400">{t.ntnCnic}</td>
                <td className="py-4">
                  <form action={async () => {
                    'use server';
                    const { adminToggleTenantProfileComplete } = await import('../../actions/tenant');
                    await adminToggleTenantProfileComplete(t.id, !t.isProfileComplete);
                  }}>
                    <button type="submit" className={`px-3 py-1 rounded-full font-bold text-xs ${t.isProfileComplete ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {t.isProfileComplete ? 'Complete' : 'Pending (Force)'}
                    </button>
                  </form>
                </td>
                <td className="py-4">{t.users.length}</td>
                <td className="py-4">
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-bold text-xs">
                    {t.subscription?.planTier || 'FREE'}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <a href={`/api/backup?tenantId=${t.id}`} download={`${t.businessName}-backup.json`} className="text-emerald-500 font-bold hover:underline text-xs">
                      Backup
                    </a>
                    <a href={`/admin/tenants/${t.id}/edit`} className="text-amber-500 font-bold hover:underline text-xs">
                      Edit
                    </a>
                    <form action={async () => {
                      'use server';
                      const { adminDeleteTenant } = await import('../../actions/admin');
                      await adminDeleteTenant(t.id);
                    }}>
                      <DeleteButton 
                        label="Delete" 
                        confirmMessage="Are you sure you want to permanently delete this company and all its data?" 
                      />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
