import React from 'react';
import { prisma } from '../../../../../lib/prisma';
import { adminUpdateTenantProfile } from '../../../../actions/admin';
import { Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function AdminTenantEditPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { id: resolvedParams.id },
    include: { subscription: true }
  });

  if (!tenant) {
    return <div className="text-white p-8">Tenant not found.</div>;
  }

  return (
    <div className="text-white font-sans p-8">
      <header className="mb-8">
        <Link href="/admin/tenants" className="text-emerald-500 hover:text-emerald-400 flex items-center gap-2 mb-4 text-sm font-bold w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Tenants
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-3">
          <Building2 className="w-7 h-7 text-emerald-500" />
          Edit Company Profile: {tenant.businessName}
        </h1>
        <p className="text-neutral-400 mt-2">Force-update company details across the platform.</p>
      </header>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-2xl">
        <form action={async (formData: FormData) => {
          'use server';
          await adminUpdateTenantProfile(tenant.id, formData);
        }} className="space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Business Name</label>
              <input type="text" name="businessName" defaultValue={tenant.businessName} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">NTN / CNIC</label>
              <input type="text" name="ntnCnic" defaultValue={tenant.ntnCnic} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Province</label>
              <select name="province" defaultValue={tenant.province} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none text-white">
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">KPK</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Federal">Federal Capital</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Phone</label>
              <input type="text" name="phone" defaultValue={tenant.phone || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
              <input type="email" name="email" defaultValue={tenant.email || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Website</label>
              <input type="text" name="website" defaultValue={tenant.website || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-1">Address</label>
              <textarea name="address" defaultValue={tenant.address} required rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none"></textarea>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-6">
            <h3 className="text-lg font-bold mb-4 text-emerald-500">Subscription & Limits</h3>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Max Staff Users</p>
                <p className="text-xs text-neutral-500">Override the maximum number of users this company can create.</p>
              </div>
              <input type="number" name="maxUsers" defaultValue={tenant.subscription?.maxUsers || 5} min={1} max={1000} required className="w-24 bg-neutral-900 border border-neutral-700 rounded-lg py-2 px-3 focus:border-emerald-500 outline-none text-white text-center font-bold" />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <input type="checkbox" name="isProfileComplete" defaultChecked={tenant.isProfileComplete} className="w-5 h-5 accent-emerald-500" />
            <div>
              <p className="font-bold text-sm">Profile Complete Status</p>
              <p className="text-xs text-neutral-500">Unchecking this will force the tenant to re-fill their onboarding setup.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-6 py-2 rounded-xl font-bold transition-all shadow-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
