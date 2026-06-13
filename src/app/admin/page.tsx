import React from 'react';
import { prisma } from '../../lib/prisma';
import { getCurrentUser } from '../actions';
import { redirect } from 'next/navigation';
import { ShieldCheck, Users, Building2, Receipt } from 'lucide-react';

export default async function AdminDashboard() {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== 'ULTIMATE_ADMIN') {
    redirect('/');
  }

  const tenants = await prisma.tenant.findMany({
    include: {
      users: true,
      invoices: true
    }
  });

  const totalUsers = tenants.reduce((acc, tenant) => acc + tenant.users.length, 0);
  const totalInvoices = tenants.reduce((acc, tenant) => acc + tenant.invoices.length, 0);

  return (
    <div className="text-white font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              Ultimate Admin Dashboard
            </h1>
            <p className="text-neutral-400">System-wide overview of all companies, users, and API usage.</p>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4 text-emerald-500 mb-2">
              <Building2 className="w-6 h-6" />
              <h3 className="font-bold text-lg">Active Tenants</h3>
            </div>
            <p className="text-4xl font-black">{tenants.length}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4 text-emerald-500 mb-2">
              <Users className="w-6 h-6" />
              <h3 className="font-bold text-lg">Total Users</h3>
            </div>
            <p className="text-4xl font-black">{totalUsers}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4 text-emerald-500 mb-2">
              <Receipt className="w-6 h-6" />
              <h3 className="font-bold text-lg">Total Invoices</h3>
            </div>
            <p className="text-4xl font-black">{totalInvoices}</p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Registered Companies</h2>
          <table className="w-full text-left">
            <thead className="border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="pb-3 font-medium">Business Name</th>
                <th className="pb-3 font-medium">NTN/CNIC</th>
                <th className="pb-3 font-medium">Users</th>
                <th className="pb-3 font-medium">Invoices</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {tenants.map(tenant => (
                <tr key={tenant.id}>
                  <td className="py-4 font-bold">{tenant.businessName}</td>
                  <td className="py-4 font-mono text-neutral-400">{tenant.ntnCnic}</td>
                  <td className="py-4">{tenant.users.length}</td>
                  <td className="py-4">{tenant.invoices.length}</td>
                  <td className="py-4 text-neutral-400">{new Date(tenant.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
