import React from 'react';
import { prisma } from '../../../lib/prisma';
import { adminUpdateSubscription } from '../../actions/admin';
import { CreditCard } from 'lucide-react';

export default async function AdminSubscriptionsPage() {
  const tenants = await prisma.tenant.findMany({
    include: { subscription: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="text-white font-sans p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-emerald-500" />
            Subscription Management
          </h1>
          <p className="text-neutral-400">Manage plan tiers and quotas for all registered companies.</p>
        </div>
      </header>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-800 text-neutral-400">
            <tr>
              <th className="pb-3 font-medium">Business Name</th>
              <th className="pb-3 font-medium">Current Plan</th>
              <th className="pb-3 font-medium">Monthly Quota</th>
              <th className="pb-3 font-medium">Used Quota</th>
              <th className="pb-3 font-medium text-right">Update Subscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {tenants.map(t => (
              <tr key={t.id}>
                <td className="py-4 font-bold text-white">{t.businessName}</td>
                <td className="py-4">
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-bold text-xs">
                    {t.subscription?.planTier || 'FREE'}
                  </span>
                </td>
                <td className="py-4 font-mono">{t.subscription?.monthlyQuota || 50}</td>
                <td className="py-4 font-mono">{t.subscription?.invoicesUsed || 0}</td>
                <td className="py-4 text-right">
                  <form action={async (formData: FormData) => {
                    'use server';
                    const tier = formData.get('planTier') as string;
                    const quota = parseInt(formData.get('monthlyQuota') as string, 10);
                    await adminUpdateSubscription(t.id, tier, quota);
                  }} className="flex items-center justify-end gap-2">
                    <select name="planTier" defaultValue={t.subscription?.planTier || 'FREE'} className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 outline-none focus:border-emerald-500">
                      <option value="FREE">FREE</option>
                      <option value="PRO">PRO</option>
                      <option value="ENTERPRISE">ENTERPRISE</option>
                    </select>
                    <input type="number" name="monthlyQuota" defaultValue={t.subscription?.monthlyQuota || 50} className="w-20 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 outline-none focus:border-emerald-500" />
                    <button type="submit" className="bg-emerald-500 text-neutral-950 px-3 py-1 rounded font-bold hover:bg-emerald-400 transition-colors">
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
