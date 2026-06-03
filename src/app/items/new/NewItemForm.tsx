'use client';

import React, { useState } from 'react';
import { Package, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createItem } from '../../actions';

export default function NewItemForm({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [desc, setDesc] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [rate, setRate] = useState('18%');
  const [uom, setUom] = useState('Numbers, pieces, units');
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !hsCode) {
      alert("Please provide the Product Description and FBR HS Code.");
      return;
    }
    
    setIsLoading(true);
    try {
      await createItem({
        tenantId,
        hsCode,
        productDescription: desc,
        rate,
        uoM: uom,
        fixedNotifiedValueOrRetailPrice: Number(price)
      });
      router.push('/items');
    } catch (err) {
      console.error(err);
      alert('Failed to save item.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-500" /> Item Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-neutral-300">Product Description *</label>
            <input 
              required 
              type="text" 
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              placeholder="e.g. Agricultural Machinery Parts" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">FBR HS Code *</label>
            <input 
              required 
              type="text" 
              value={hsCode}
              onChange={e => setHsCode(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono" 
              placeholder="e.g. 0101.2100" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Applicable Sales Tax Rate *</label>
            <select 
              value={rate}
              onChange={e => setRate(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option value="18%">18% (Standard)</option>
              <option value="5%">5% (Reduced)</option>
              <option value="0%">0% (Exempt/Zero Rated)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Default Unit of Measure (UOM) *</label>
            <select 
              value={uom}
              onChange={e => setUom(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option value="Numbers, pieces, units">Numbers, pieces, units</option>
              <option value="KG">Kilograms (KG)</option>
              <option value="Square Metre">Square Metre</option>
              <option value="Litres">Litres</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Default Retail Price / Fixed Value</label>
            <input 
              type="number" 
              step="0.01" 
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              placeholder="0.00" 
            />
            <p className="text-xs text-neutral-500">Leave 0 if dynamic pricing applies during invoicing.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-neutral-950 px-8 py-3 rounded-xl font-bold transition-all transform active:scale-[0.98]"
        >
          <Save className="w-5 h-5" />
          {isLoading ? 'Saving...' : 'Save Item'}
        </button>
      </div>
    </form>
  );
}
