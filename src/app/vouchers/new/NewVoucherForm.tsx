'use client';

import React, { useState } from 'react';
import { Receipt, Save, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { createInvoice } from '../../actions';
import { useRouter } from 'next/navigation';

export default function NewVoucherForm({ clients, items, tenantId }: { clients: any[], items: any[], tenantId: string }) {
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [invoiceType, setInvoiceType] = useState('Sale Invoice');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  
  const [lineItems, setLineItems] = useState<any[]>([]);

  const handleAddItem = () => {
    if (items.length === 0) return;
    const defaultItem = items[0];
    setLineItems([
      ...lineItems, 
      { 
        itemId: defaultItem.id, 
        hsCode: defaultItem.hsCode,
        productDescription: defaultItem.productDescription,
        rate: defaultItem.rate,
        uoM: defaultItem.uoM,
        quantity: 1, 
        price: defaultItem.fixedNotifiedValueOrRetailPrice || 0 
      }
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    if (field === 'itemId') {
      const selectedDef = items.find(i => i.id === value);
      updated[index] = {
        ...updated[index],
        itemId: value,
        hsCode: selectedDef.hsCode,
        productDescription: selectedDef.productDescription,
        rate: selectedDef.rate,
        uoM: selectedDef.uoM,
        price: selectedDef.fixedNotifiedValueOrRetailPrice || 0
      };
    } else {
      updated[index][field] = value;
    }
    setLineItems(updated);
  };

  const removeItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const getTaxRate = (rateStr: string) => parseFloat(rateStr.replace('%', '')) || 0;

  const calculateTotals = () => {
    let subtotal = 0;
    let tax = 0;
    lineItems.forEach(item => {
      const lineSub = item.quantity * item.price;
      subtotal += lineSub;
      tax += lineSub * (getTaxRate(item.rate) / 100);
    });
    return { subtotal, tax, total: subtotal + tax };
  };

  const totals = calculateTotals();

  const handleSave = async (status: string) => {
    if (!clientId || !invoiceDate || lineItems.length === 0) {
      alert("Please fill in all required fields and add at least one item.");
      return;
    }

    const payload = {
      tenantId,
      clientId,
      invoiceType,
      invoiceDate: new Date(invoiceDate),
      invoiceRefNo: referenceNo || null,
      status: status, // DRAFT or PENDING_FBR
      items: {
        create: lineItems.map(li => {
          const lineSub = li.quantity * li.price;
          const lineTax = lineSub * (getTaxRate(li.rate) / 100);
          return {
            hsCode: li.hsCode,
            productDescription: li.productDescription,
            rate: li.rate,
            uoM: li.uoM,
            quantity: Number(li.quantity),
            valueSalesExcludingST: lineSub,
            totalValues: lineSub + lineTax,
            fixedNotifiedValueOrRetailPrice: Number(li.price),
            salesTaxApplicable: lineTax
          };
        })
      }
    };

    try {
      await createInvoice(payload);
      router.push('/vouchers');
    } catch (error) {
      console.error(error);
      alert("Failed to save voucher.");
    }
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Client / Buyer *</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
              <option value="">Select a registered client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.buyerBusinessName} ({c.buyerRegistrationType})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Invoice Type *</label>
            <select value={invoiceType} onChange={e => setInvoiceType(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
              <option value="Sale Invoice">Sale Invoice</option>
              <option value="Debit Note">Debit Note</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Invoice Date *</label>
            <input required type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Reference No.</label>
            <input type="text" value={referenceNo} onChange={e => setReferenceNo(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Required for Debit Notes" />
          </div>
        </div>

        <hr className="border-neutral-800 my-8" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-500" /> Line Items
          </h2>
          <button type="button" onClick={handleAddItem} className="flex items-center gap-1.5 text-sm font-bold text-emerald-500 hover:text-emerald-400">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-950">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b border-neutral-800 text-neutral-400 bg-neutral-900/50">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium w-24">Qty</th>
                <th className="px-4 py-3 font-medium w-32">Price/Unit</th>
                <th className="px-4 py-3 font-medium w-20">Tax %</th>
                <th className="px-4 py-3 font-medium w-32">Total</th>
                <th className="px-4 py-3 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {lineItems.length === 0 && (
                <tr><td colSpan={6} className="text-center py-6 text-neutral-500">No items added. Click 'Add Item' to start.</td></tr>
              )}
              {lineItems.map((li, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3">
                    <select value={li.itemId} onChange={e => updateItem(idx, 'itemId', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-emerald-500 transition-colors">
                      {items.map(item => (
                        <option key={item.id} value={item.id}>{item.productDescription} ({item.hsCode})</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min="1" value={li.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} className="w-20 bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min="0" value={li.price} onChange={e => updateItem(idx, 'price', Number(e.target.value))} className="w-28 bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{li.rate}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-500">
                    {((li.quantity * li.price) * (1 + getTaxRate(li.rate)/100)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => removeItem(idx)} className="text-rose-500 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="mt-8 flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Subtotal (Excl. Tax)</span>
              <span className="font-mono text-white">{totals.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Sales Tax</span>
              <span className="font-mono text-white">{totals.tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <hr className="border-neutral-800" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total (PKR)</span>
              <span className="font-mono text-emerald-500">{totals.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => handleSave('DRAFT')} className="px-8 py-3 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-white font-bold transition-all">
          Save Draft
        </button>
        <button type="button" onClick={() => handleSave('PENDING_FBR')} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-8 py-3 rounded-xl font-bold transition-all transform active:scale-[0.98]">
          <ShieldCheck className="w-5 h-5" />
          Post to FBR
        </button>
      </div>
    </form>
  );
}
