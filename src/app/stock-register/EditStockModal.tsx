'use client';

import React, { useState } from 'react';
import { Edit2, X, Loader2 } from 'lucide-react';
import { updateStockOpeningBalance } from '../actions';
import { useRouter } from 'next/navigation';

export default function EditStockModal({ stock }: { stock: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [qty, setQty] = useState(stock.openingQty);
  const [val, setVal] = useState(stock.openingVal);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateStockOpeningBalance(stock.id, Number(qty), Number(val));
    setLoading(false);
    
    if (result?.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      alert(`Error: ${result?.error}`);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-neutral-500 hover:text-emerald-500 transition-colors ml-2"
        title="Edit Opening Balance"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
              <h3 className="text-lg font-bold">Edit Opening Balance</h3>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">HS Code</label>
                <div className="text-white font-mono">{stock.hsCode}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Opening Qty</label>
                  <input
                    type="number"
                    step="any"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Opening Value</label>
                  <input
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-sm font-bold transition-transform active:scale-95 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
