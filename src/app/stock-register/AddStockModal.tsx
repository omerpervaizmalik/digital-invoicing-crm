'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFbrDropdownOptions, addManualStock } from '../actions';
import SearchableDropdown from '../components/SearchableDropdown';

export default function AddStockModal({ tenantId, monthYear }: { tenantId: string, monthYear: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [fbrOptions, setFbrOptions] = useState<any>({ rates: [], uoms: [] });
  const [loading, setLoading] = useState(false);

  const [hsCode, setHsCode] = useState('');
  const [uom, setUom] = useState('Numbers, pieces, units');
  const [rate, setRate] = useState('0.18');
  const [val, setVal] = useState('');
  const [qty, setQty] = useState('');
  const [type, setType] = useState('purchased');

  useEffect(() => {
    if (isOpen) {
      getFbrDropdownOptions().then(setFbrOptions);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hsCode || !uom || !rate || !val || !qty) return alert('Fill all required fields');
    
    setLoading(true);
    try {
      await addManualStock({
        tenantId,
        monthYear,
        hsCode,
        uoM: uom,
        salesTaxRate: rate,
        val: parseFloat(val),
        qty: parseFloat(qty),
        type
      });
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-4 py-2 rounded-lg text-sm font-bold transition-all"
      >
        + Add Stock
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#eef5fd] text-neutral-800 rounded shadow-2xl w-full max-w-3xl overflow-hidden border border-[#b2d1f0]">
            <div className="flex justify-between items-center bg-[#84b6e8] px-4 py-2 text-white font-medium text-sm">
              <span>Add Stock</span>
              <button onClick={() => setIsOpen(false)} className="hover:text-neutral-200">✖</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                
                {/* Transaction Type */}
                <div className="col-span-2 flex items-center justify-center gap-4 bg-white p-3 border border-[#ccdcf0] rounded">
                  <span className="font-medium text-neutral-600">Entry Type:</span>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="type" checked={type==='purchased'} onChange={()=>setType('purchased')} /> Incoming (Purchase)</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="type" checked={type==='opening'} onChange={()=>setType('opening')} /> Opening Balance</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="type" checked={type==='domestic'} onChange={()=>setType('domestic')} /> Outgoing (Taxable)</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="type" checked={type==='exempt'} onChange={()=>setType('exempt')} /> Outgoing (Exempt)</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="type" checked={type==='zeroRated'} onChange={()=>setType('zeroRated')} /> Outgoing (Zero Rated)</label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right text-neutral-600">HS Code <span className="text-red-500">*</span></label>
                  <div className="flex-1">
                    <SearchableDropdown value={hsCode} onChange={setHsCode} placeholder="Select" className="text-black bg-white !rounded-none !border-[#ccdcf0] [&>input]:!bg-white [&>input]:!border-[#ccdcf0] [&>input]:!text-black [&>input]:!py-1" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Empty space to align like the image if needed, or put something else. The image just has 2 cols */}
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right text-neutral-600">UoM <span className="text-red-500">*</span></label>
                  <select value={uom} onChange={e=>setUom(e.target.value)} className="flex-1 bg-white border border-[#ccdcf0] py-1 px-2 focus:outline-none">
                    <option value="">Select</option>
                    {fbrOptions.uoms.map((u: string) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-28 text-right text-neutral-600">Sales Tax Rate <span className="text-red-500">*</span></label>
                  <select value={rate} onChange={e=>setRate(e.target.value)} className="flex-1 bg-white border border-[#ccdcf0] py-1 px-2 focus:outline-none">
                    <option value="">Select</option>
                    {fbrOptions.rates.map((r: string) => <option key={r} value={r}>{Number(r) * 100}%</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right text-neutral-600">Value of Goods <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" value={val} onChange={e=>setVal(e.target.value)} className="flex-1 bg-white border border-[#ccdcf0] py-1 px-2 focus:outline-none" />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-28 text-right text-neutral-600">Quantity of Goods <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" value={qty} onChange={e=>setQty(e.target.value)} className="flex-1 bg-white border border-[#ccdcf0] py-1 px-2 focus:outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="submit" disabled={loading} className="bg-[#eaf1f8] border border-[#a2c3e4] hover:bg-[#d8e6f3] px-6 py-1 text-neutral-700 transition-colors">
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setIsOpen(false)} className="bg-[#eaf1f8] border border-[#a2c3e4] hover:bg-[#d8e6f3] px-6 py-1 text-neutral-700 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
