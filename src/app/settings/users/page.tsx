import React from 'react';
import { prisma } from '../../../lib/prisma';
import { getCurrentTenant } from '../../actions';
import { Users, Plus, Shield, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { tenantCreateUser, tenantUpdateUserRole, tenantDeleteUser } from '../../actions/tenant';
import { DeleteButton } from '../../admin/components/DeleteButton';

export default async function SettingsUsersPage() {
  const tenant = await getCurrentTenant();
  
  if (!tenant) {
    redirect('/login');
  }

  const subscription = await prisma.subscription.findUnique({ where: { tenantId: tenant.id } });
  const maxUsers = subscription?.maxUsers || 5;

  const users = await prisma.user.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: 'desc' }
  });

  const isAtLimit = users.length >= maxUsers;
  const limitPercentage = Math.min((users.length / maxUsers) * 100, 100);

  return (
    <div>
      <div className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-500" />
          Staff User Limit
        </h2>
        <p className="text-neutral-400 text-sm mb-4">
          Your current plan allows up to {maxUsers} staff accounts. To increase this limit, please contact support or upgrade your subscription.
        </p>
        <div className="w-full bg-neutral-950 rounded-full h-3 mb-2">
          <div className={`h-3 rounded-full ${isAtLimit ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${limitPercentage}%` }}></div>
        </div>
        <p className="text-xs font-bold text-neutral-300 text-right">
          {users.length} of {maxUsers} used
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-500" />
          Add New Team Member
        </h2>
        {isAtLimit ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold">
            You have reached your maximum user limit of {maxUsers}. You cannot create more users until you upgrade your plan or delete existing users.
          </div>
        ) : (
          <form action={tenantCreateUser} className="grid grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Full Name</label>
              <input type="text" name="name" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm focus:border-emerald-500 outline-none text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Email Address</label>
              <input type="email" name="email" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm focus:border-emerald-500 outline-none text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Temporary Password</label>
              <input type="text" name="password" required minLength={6} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm focus:border-emerald-500 outline-none text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Role</label>
              <select name="role" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-3 text-sm focus:border-emerald-500 outline-none text-white">
                <option value="STANDARD_USER">Standard User (Data Entry)</option>
                <option value="SUPERVISOR">Supervisor (Approval)</option>
              </select>
            </div>
            <div className="col-span-4 mt-2">
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-2.5 rounded-lg transition-colors">
                Create User
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">Active Team Members</h2>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-800 text-neutral-400">
            <tr>
              <th className="pb-3 font-medium">Name & Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {users.map(u => (
              <tr key={u.id}>
                <td className="py-4">
                  <div className="font-bold text-white">{u.name}</div>
                  <div className="text-neutral-500">{u.email}</div>
                </td>
                <td className="py-4">
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-bold text-xs">
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 text-right">
                  {u.role !== 'TENANT_ADMIN' ? (
                    <div className="flex items-center justify-end gap-3">
                      <form action={async (formData: FormData) => {
                        'use server';
                        await tenantUpdateUserRole(u.id, formData.get('role') as string);
                      }} className="flex items-center gap-2">
                        <select name="role" defaultValue={u.role} className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 outline-none focus:border-emerald-500 text-xs text-white">
                          <option value="STANDARD_USER">STANDARD USER</option>
                          <option value="SUPERVISOR">SUPERVISOR</option>
                        </select>
                        <button type="submit" className="text-emerald-500 hover:text-emerald-400 font-bold text-xs">Update</button>
                      </form>
                      
                      <form action={async () => {
                        'use server';
                        await tenantDeleteUser(u.id);
                      }}>
                        <DeleteButton 
                          label="Delete" 
                          confirmMessage="Are you sure you want to delete this user from your team?" 
                        />
                      </form>
                    </div>
                  ) : (
                    <span className="text-neutral-500 italic text-xs">Company Owner</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
