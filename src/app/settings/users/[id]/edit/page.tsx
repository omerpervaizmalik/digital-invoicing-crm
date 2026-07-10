import React from 'react';
import { prisma } from '../../../../../lib/prisma';
import { getCurrentTenant, getCurrentUser } from '../../../../actions';
import { redirect } from 'next/navigation';
import { UserCog, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { tenantUpdateUser } from '../../../../actions/tenant';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const tenant = await getCurrentTenant();
  const currentUser = await getCurrentUser();

  if (!tenant || !currentUser || currentUser.role !== 'TENANT_ADMIN') {
    redirect('/login');
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user || user.tenantId !== tenant.id) {
    redirect('/settings/users');
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/settings/users" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-bold">
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <UserCog className="w-5 h-5 text-emerald-500" />
          Edit Team Member
        </h2>

        <form action={async (formData: FormData) => {
          'use server';
          await tenantUpdateUser(user.id, formData);
          redirect('/settings/users');
        }} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Full Name</label>
            <input type="text" name="name" defaultValue={user.name || ''} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm focus:border-emerald-500 outline-none text-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Email Address</label>
            <input type="email" name="email" defaultValue={user.email} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm focus:border-emerald-500 outline-none text-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Role</label>
            <select name="role" defaultValue={user.role} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm focus:border-emerald-500 outline-none text-white">
              <option value="STANDARD_USER">Standard User (Data Entry)</option>
              <option value="SUPERVISOR">Supervisor (Approval)</option>
              {user.role === 'TENANT_ADMIN' && <option value="TENANT_ADMIN">Tenant Admin (Owner)</option>}
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Link href="/settings/users" className="px-6 py-2.5 rounded-lg font-bold text-sm text-neutral-400 hover:text-white transition-colors">
              Cancel
            </Link>
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-6 py-2.5 rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
