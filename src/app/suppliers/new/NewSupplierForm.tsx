'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupplier } from '../../actions';
import { Building2, Save } from 'lucide-react';

export default function NewSupplierForm({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [businessName, setBusinessName] = useState('');
  const [ntnCnic, setNtnCnic] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [address, setAddress] = useState('');
  const [registrationType, setRegistrationType] = useState('Registered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await createSupplier({
      tenantId,
      sellerBusinessName: businessName,
      sellerNTNCNIC: ntnCnic,
      sellerProvince: province,
      sellerAddress: address,
      sellerRegistrationType: registrationType
    });
    
    router.push('/suppliers');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-300">Supplier Business Name <span className="text-emerald-500">*</span></label>
          <input 
            required
            type="text" 
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="e.g. Alpha Manufacturing"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-300">Registration Type <span className="text-emerald-500">*</span></label>
          <select 
            value={registrationType}
            onChange={e => setRegistrationType(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
          >
            <option value="Registered">Registered</option>
            <option value="Unregistered">Unregistered</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-300">NTN / CNIC</label>
          <input 
            type="text" 
            value={ntnCnic}
            onChange={e => setNtnCnic(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            placeholder="e.g. 1234567-8"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-300">Province / Region <span className="text-emerald-500">*</span></label>
          <select 
            value={province}
            onChange={e => setProvince(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
          >
            <option value="Punjab">Punjab</option>
            <option value="Sindh">Sindh</option>
            <option value="KPK">KPK</option>
            <option value="Balochistan">Balochistan</option>
            <option value="Islamabad">Islamabad</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-300">Business Address <span className="text-emerald-500">*</span></label>
        <input 
          required
          type="text" 
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          placeholder="e.g. 456 Industrial Estate Road"
        />
      </div>

      <div className="pt-6 border-t border-neutral-800 flex justify-end">
        <button 
          disabled={isSubmitting}
          type="submit" 
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-6 py-3 rounded-xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'Saving...' : 'Save Supplier'}
        </button>
      </div>
    </form>
  );
}
