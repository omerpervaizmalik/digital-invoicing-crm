'use client';

import React, { useState } from 'react';
import { Package, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createItem, getFbrDropdownOptions } from '../../actions';
import SearchableDropdown from '../../components/SearchableDropdown';

export default function NewItemForm({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [itemCode, setItemCode] = useState('');
  const [desc, setDesc] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [rate, setRate] = useState('0.18');
  const [uom, setUom] = useState('Numbers, pieces, units');
  const [unitPrice, setUnitPrice] = useState(0);
  const [fixedValue, setFixedValue] = useState(0);
  const [saleType, setSaleType] = useState('Goods at standard rate (default)');
  const [sroScheduleNo, setSroScheduleNo] = useState('');
  const [sroItemSerialNo, setSroItemSerialNo] = useState('');
  const [petroleumLevyOn, setPetroleumLevyOn] = useState('');
  const [initialQty, setInitialQty] = useState(0);
  const [initialVal, setInitialVal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fbrOptions, setFbrOptions] = useState<any>({ rates: [], uoms: [] });

  React.useEffect(() => {
    getFbrDropdownOptions().then(setFbrOptions);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemCode || !desc || !hsCode) {
      alert("Please provide the Item Code, Product Description, and FBR HS Code.");
      return;
    }
    
    setIsLoading(true);
    try {
      await createItem({
        tenantId,
        itemCode,
        hsCode,
        productDescription: desc,
        rate,
        uoM: uom,
        unitPrice: Number(unitPrice),
        fixedNotifiedValueOrRetailPrice: Number(fixedValue),
        initialStock: Number(initialQty),
        initialStockValue: Number(initialVal),
        saleType,
        sroScheduleNo: sroScheduleNo || null,
        sroItemSerialNo: sroItemSerialNo || null,
        petroleumLevyOn: petroleumLevyOn || null
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
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-sm font-medium text-neutral-300">Unique Item Code *</label>
            <input 
              required 
              type="text" 
              value={itemCode}
              onChange={e => setItemCode(e.target.value.toUpperCase())}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              placeholder="e.g. PRD-001" 
            />
          </div>

          <div className="space-y-2 col-span-2 md:col-span-1">
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
            <SearchableDropdown 
              value={hsCode}
              onChange={setHsCode}
              placeholder="Search by code or description..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Applicable Sales Tax Rate *</label>
            <select 
              value={rate}
              onChange={e => setRate(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              {fbrOptions.rates.length > 0 ? (
                fbrOptions.rates.map((r: string) => {
                  const num = Number(r);
                  return <option key={r} value={r}>{num * 100}%</option>;
                })
              ) : (
                <>
                  <option value="0.18">18% (Standard)</option>
                  <option value="0.05">5% (Reduced)</option>
                  <option value="0">0% (Exempt/Zero Rated)</option>
                </>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Default Unit of Measure (UOM) *</label>
            <select 
              value={uom}
              onChange={e => setUom(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              {fbrOptions.uoms.length > 0 ? (
                fbrOptions.uoms.map((u: string) => <option key={u} value={u}>{u}</option>)
              ) : (
                <>
                  <option value="Numbers, pieces, units">Numbers, pieces, units</option>
                  <option value="KG">Kilograms (KG)</option>
                  <option value="Square Metre">Square Metre</option>
                  <option value="Litres">Litres</option>
                </>
              )}
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
              placeholder="0.00" 
            />
            <p className="text-xs text-neutral-500">Leave 0 if dynamic pricing applies during invoicing.</p>
          </div>

          {saleType.toLowerCase().includes('3rd schedule') && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-400 leading-tight">
                Fix / Notified Value or Retail price / Higher of actucal and minimum fixed value of supplies *
              </label>
              <input 
                type="number" 
                step="0.01" 
                value={fixedValue}
                onChange={e => setFixedValue(Number(e.target.value))}
                className="w-full bg-amber-950/20 border border-amber-500/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                placeholder="0.00" 
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
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
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
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
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
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
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
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option value="">None</option>
              {fbrOptions.petroleumLevyOn?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-2 col-span-2">
            <hr className="border-neutral-800 my-4" />
            <h3 className="text-sm font-bold text-emerald-500 mb-4">Initial Stock</h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-500 font-bold">Initial Stock Quantity (Optional)</label>
            <input 
              type="number" 
              step="0.01" 
              value={initialQty}
              onChange={e => setInitialQty(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-emerald-500/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              placeholder="0" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-500 font-bold">Initial Stock Total Value (Optional)</label>
            <input 
              type="number" 
              step="0.01" 
              value={initialVal}
              onChange={e => setInitialVal(Number(e.target.value))}
              className="w-full bg-neutral-950 border border-emerald-500/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              placeholder="0.00" 
            />
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
