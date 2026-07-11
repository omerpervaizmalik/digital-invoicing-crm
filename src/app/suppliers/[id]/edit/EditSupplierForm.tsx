'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSupplier } from '../../../actions';
import { Save } from 'lucide-react';

export default function EditSupplierForm({ supplier }: { supplier: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [businessName, setBusinessName] = useState(supplier.sellerBusinessName);
  const [ntnCnic, setNtnCnic] = useState(supplier.sellerNTNCNIC || '');
  const [province, setProvince] = useState(supplier.sellerProvince);
  const [address, setAddress] = useState(supplier.sellerAddress);
  const [registrationType, setRegistrationType] = useState(supplier.sellerRegistrationType);
  const [contactNo, setContactNo] = useState(supplier.contactNo || '');
  const [branchName, setBranchName] = useState(supplier.branchName || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await updateSupplier(supplier.id, {
        sellerBusinessName: businessName,
        sellerNTNCNIC: ntnCnic,
        sellerProvince: province,
        sellerAddress: address,
        sellerRegistrationType: registrationType,
        contactNo,
        branchName
      });
      
      if (res?.error) {
        alert(res.error);
        setIsSubmitting(false);
        return;
      }
      
      router.push('/suppliers');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update supplier.');
      setIsSubmitting(false);
    }
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
          <label className="text-sm font-semibold text-neutral-300">NTN / CNIC <span className="text-emerald-500">*</span></label>
          <input 
            required
            type="text" 
            value={ntnCnic}
            onChange={e => setNtnCnic(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-300">Contact No</label>
          <input 
            type="text" 
            value={contactNo}
            onChange={e => setContactNo(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-300">Branch Name (Optional)</label>
          <input 
            type="text" 
            value={branchName}
            onChange={e => setBranchName(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
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
        />
      </div>

      <div className="pt-6 border-t border-neutral-800 flex justify-end">
        <button 
          disabled={isSubmitting}
          type="submit" 
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-6 py-3 rounded-xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'Saving...' : 'Update Supplier'}
        </button>
      </div>
    </form>
  );
}
