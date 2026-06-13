import React from 'react';
import { prisma } from '../../../lib/prisma';
import { adminCreateUser, adminUpdateUserRole } from '../../actions/admin';
import { Users, Plus, Shield } from 'lucide-react';
import { DeleteButton } from '../components/DeleteButton';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { tenant: true },
    orderBy: { createdAt: 'desc' }
  });

  const tenants = await prisma.tenant.findMany({
    select: { id: true, businessName: true }
  });

  return (
    <div className="text-white font-sans p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <Users className="w-7 h-7 text-emerald-500" />
            User Management
          </h1>
          <p className="text-neutral-400">Create users, assign roles, and manage tenant associations.</p>
        </div>
      </header>

      <div className="grid grid-cols-[1fr_350px] gap-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">All Users</h2>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="pb-3 font-medium">Name & Email</th>
                <th className="pb-3 font-medium">Company (Tenant)</th>
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
                    {u.tenant?.businessName || <span className="text-neutral-500 italic">None (System)</span>}
                  </td>
                  <td className="py-4">
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-bold text-xs">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {u.role !== 'ULTIMATE_ADMIN' ? (
                        <div className="flex flex-col gap-2 items-end">
                          <form action={async (formData: FormData) => {
                            'use server';
                            const newRole = formData.get('role') as string;
                            await adminUpdateUserRole(u.id, newRole);
                          }} className="flex items-center gap-2">
                            <select name="role" defaultValue={u.role} className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 outline-none focus:border-emerald-500 text-xs">
                              <option value="STANDARD_USER">STANDARD USER</option>
                              <option value="SUPERVISOR">SUPERVISOR</option>
                              <option value="TENANT_ADMIN">TENANT ADMIN</option>
                            </select>
                            <button type="submit" className="text-emerald-500 hover:text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded">Update</button>
                          </form>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <form action={async (formData: FormData) => {
                              'use server';
                              const { adminResetUserPassword } = await import('../../actions/admin');
                              await adminResetUserPassword(u.id, formData);
                            }} className="flex items-center gap-2">
                              <input type="text" name="password" placeholder="New Password" required minLength={6} className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 outline-none focus:border-red-500 text-xs w-32 text-neutral-300" />
                              <button type="submit" className="text-red-500 hover:text-red-400 font-bold text-xs bg-red-500/10 px-2 py-1 rounded">Reset Pass</button>
                            </form>

                            <form action={async () => {
                              'use server';
                              const { adminDeleteUser } = await import('../../actions/admin');
                              await adminDeleteUser(u.id);
                            }}>
                              <DeleteButton 
                                label="Delete User" 
                                confirmMessage="Are you sure you want to delete this user?" 
                              />
                            </form>
                            
                            {u.tenantId && (
                              <form action={async () => {
                                'use server';
                                const { adminDeleteTenant } = await import('../../actions/admin');
                                await adminDeleteTenant(u.tenantId as string);
                              }}>
                                <DeleteButton 
                                  label="Delete Company" 
                                  confirmMessage="Are you sure you want to delete this users ENTIRE COMPANY and all its data?" 
                                  className="text-red-600 hover:underline font-bold text-xs ml-2 border-l border-neutral-700 pl-2"
                                />
                              </form>
                            )}
                          </div>
                        </div>
                    ) : (
                      <span className="text-neutral-500 text-xs italic">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              Create New User
            </h2>
            <form action={adminCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Full Name</label>
                <input type="text" name="name" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                <input type="email" name="email" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Temporary Password</label>
                <input type="text" name="password" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Assign to Company</label>
                <select name="tenantId" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none text-white">
                  <option value="NONE">None (System User)</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.businessName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Role</label>
                <select name="role" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 focus:border-emerald-500 outline-none text-white">
                  <option value="STANDARD_USER">Standard User</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="TENANT_ADMIN">Tenant Admin</option>
                  <option value="ULTIMATE_ADMIN">Ultimate Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 py-3 rounded-xl font-bold transition-all shadow-lg mt-2">
                Create User
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
