'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateItem, getFbrDropdownOptions } from '../../../actions';

export default function EditItemForm({ item, currentStock }: { item: any, currentStock: number }) {
  const router = useRouter();
  const [itemCode, setItemCode] = useState(item.itemCode || '');
  const [desc, setDesc] = useState(item.productDescription);
  const [hsCode, setHsCode] = useState(item.hsCode);
  const [rate, setRate] = useState(item.rate);
  const [uom, setUom] = useState(item.uoM);
  const [unitPrice, setUnitPrice] = useState(item.unitPrice || 0);
  const [fixedValue, setFixedValue] = useState(item.fixedNotifiedValueOrRetailPrice || 0);
  const [saleType, setSaleType] = useState(item.saleType || 'Goods at standard rate (default)');
  const [sroScheduleNo, setSroScheduleNo] = useState(item.sroScheduleNo || '');
  const [sroItemSerialNo, setSroItemSerialNo] = useState(item.sroItemSerialNo || '');
  const [petroleumLevyOn, setPetroleumLevyOn] = useState(item.petroleumLevyOn || '');
  const [isLoading, setIsLoading] = useState(false);
  const [fbrOptions, setFbrOptions] = useState<any>({ rates: [], uoms: [] });

  useEffect(() => {
    getFbrDropdownOptions().then(setFbrOptions);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateItem(item.id, {
        itemCode,
        productDescription: desc,
        hsCode,
        rate,
        uoM: uom,
        unitPrice: Number(unitPrice),
        fixedNotifiedValueOrRetailPrice: Number(fixedValue),
        saleType,
        sroScheduleNo: sroScheduleNo || null,
        sroItemSerialNo: sroItemSerialNo || null,
        petroleumLevyOn: petroleumLevyOn || null
      });
      router.push('/items');
    } catch (err) {
      console.error(err);
      alert('Failed to update item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col gap-8">
      
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-6 rounded bg-emerald-500 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-neutral-950 rounded-sm"></div>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Edit Item Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-medium text-neutral-300">Unique Item Code <span className="text-emerald-500">*</span></label>
            <input 
              type="text" 
              value={itemCode}
              onChange={e => setItemCode(e.target.value.toUpperCase())}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              required
            />
          </div>

          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-medium text-neutral-300">Product Description <span className="text-emerald-500">*</span></label>
            <input 
              type="text" 
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">FBR HS Code <span className="text-emerald-500">*</span></label>
            <input 
              type="text" 
              value={hsCode}
              onChange={e => setHsCode(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Applicable Sales Tax Rate <span className="text-emerald-500">*</span></label>
            <select 
              value={rate}
              onChange={e => setRate(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              required
            >
              <option value="">Select Rate</option>
              {fbrOptions.rates.map((r: string) => <option key={r} value={r}>{Number(r) * 100}%</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Default Unit of Measure (UOM) <span className="text-emerald-500">*</span></label>
            <select 
              value={uom}
              onChange={e => setUom(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              required
            >
              <option value="">Select UOM</option>
              {fbrOptions.uoms.map((u: string) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Default Unit Price (PKR)</label>
            <input 
              type="number" 
              step="0.01" 
              value={unitPrice}
              onChange={e => setUnitPrice(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
            />
            <p className="text-xs text-neutral-500">Leave 0 if dynamic pricing applies during invoicing.</p>
          </div>

          {saleType?.toLowerCase().includes('3rd schedule') && (
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-amber-400 leading-tight">
                Fix / Notified Value or Retail price / Higher of actucal and minimum fixed value of supplies *
              </label>
              <input 
                type="number" 
                step="0.01" 
                value={fixedValue}
                onChange={e => setFixedValue(Number(e.target.value))}
                className="w-full bg-amber-950/20 border border-amber-500/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 transition-colors" 
              />
            </div>
          )}

          <div className="space-y-2 col-span-2">
            <hr className="border-neutral-800 my-4" />
            <h3 className="text-sm font-bold text-neutral-300 mb-4">Advanced FBR Defaults</h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Sale Type (Required for FBR)</label>
            <select 
              value={saleType}
              onChange={e => setSaleType(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {fbrOptions.saleTypes?.length > 0 ? (
                fbrOptions.saleTypes.map((t: string) => <option key={t} value={t}>{t}</option>)
              ) : (
                <option value="Goods at standard rate (default)">Goods at standard rate</option>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">SRO No. / Schedule No.</label>
            <select 
              value={sroScheduleNo}
              onChange={e => setSroScheduleNo(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">None</option>
              {fbrOptions.sros?.map((sro: string) => <option key={sro} value={sro}>{sro}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Item S. No.</label>
            <select 
              value={sroItemSerialNo}
              onChange={e => setSroItemSerialNo(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">None</option>
              {fbrOptions.itemSrNos?.map((no: string) => <option key={no} value={no}>{no}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Petroleum Levy On</label>
            <select 
              value={petroleumLevyOn}
              onChange={e => setPetroleumLevyOn(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">None</option>
              {fbrOptions.petroleumLevyOn?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-neutral-300">Current Stock Quantity</h3>
            <p className="text-xs text-neutral-500">Dynamically calculated from the FBR Stock Register.</p>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">{currentStock}</div>
        </div>
      </div>

      <div className="flex justify-end pt-4 gap-4">
        <button 
          type="button" 
          onClick={() => router.push('/items')}
          className="bg-transparent hover:bg-neutral-800 text-neutral-300 px-6 py-3 rounded-xl font-bold transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
