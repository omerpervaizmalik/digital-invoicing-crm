import React from 'react';
import { adminCreateTenant } from '../../../actions/admin';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function NewTenantPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 md:p-6 font-sans text-white relative">
      <div className="w-full max-w-2xl mb-6">
        <Link href="/admin/tenants" className="inline-flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tenants
        </Link>
      </div>

      <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-2xl shadow-xl z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-20 w-20 rounded-2xl bg-neutral-800 flex items-center justify-center border border-neutral-700 mb-6">
            <Building2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create New Tenant</h1>
          <p className="text-neutral-400">Register a new company and their initial admin user.</p>
        </div>
        
        <form action={adminCreateTenant} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-emerald-500 border-b border-neutral-800 pb-2">Admin Details</h3>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Full Name</label>
                <input type="text" name="name" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                <input type="email" name="email" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Temporary Password</label>
                <input type="password" name="password" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-emerald-500 border-b border-neutral-800 pb-2">Company Details</h3>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Business Name</label>
                <input type="text" name="businessName" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">NTN / CNIC</label>
                <input type="text" name="ntnCnic" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Province</label>
                  <input type="text" name="province" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Address</label>
                  <input type="text" name="address" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 py-3 rounded-xl font-bold transition-all shadow-lg mt-8">
            Create Tenant
          </button>
        </form>
      </div>
    </div>
  );
}
