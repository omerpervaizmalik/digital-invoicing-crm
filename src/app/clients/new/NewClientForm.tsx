'use client';

import React, { useState } from 'react';
import { Building2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../actions';

export default function NewClientForm({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('Registered');
  const [ntn, setNtn] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) {
      alert("Please provide the Business Name and Address.");
      return;
    }
    
    setIsLoading(true);
    try {
      await createClient({
        tenantId,
        buyerBusinessName: name,
        buyerRegistrationType: type,
        buyerNTNCNIC: ntn,
        buyerProvince: province,
        buyerAddress: address
      });
      router.push('/clients');
    } catch (err) {
      console.error(err);
      alert('Failed to save client.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-500" /> Business Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-neutral-300">Buyer Business Name *</label>
            <input 
              required 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              placeholder="Enter business name" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Registration Type *</label>
            <select 
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option value="Registered">Registered</option>
              <option value="Unregistered">Unregistered</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">NTN / CNIC</label>
            <input 
              type="text" 
              value={ntn}
              onChange={e => setNtn(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              placeholder="7 or 13 digits" 
            />
            <p className="text-xs text-neutral-500">Required if type is Registered.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Province *</label>
            <select 
              value={province}
              onChange={e => setProvince(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option value="Punjab">Punjab</option>
              <option value="Sindh">Sindh</option>
              <option value="KPK">Khyber Pakhtunkhwa</option>
              <option value="Balochistan">Balochistan</option>
              <option value="Islamabad">Islamabad Capital Territory</option>
            </select>
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-neutral-300">Business Address *</label>
            <textarea 
              required 
              rows={3} 
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              placeholder="Full street address"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 px-8 py-3 rounded-xl font-bold transition-all transform active:scale-[0.98]"
        >
          <Save className="w-5 h-5" />
          {isLoading ? 'Saving...' : 'Save Client Profile'}
        </button>
      </div>
    </form>
  );
}
