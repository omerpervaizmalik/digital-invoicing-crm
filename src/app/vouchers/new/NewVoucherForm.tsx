'use client';

import React, { useState } from 'react';
import { Receipt, Save, ShieldCheck, Plus, Trash2, Edit, X } from 'lucide-react';
import { createInvoice, getFbrDropdownOptions } from '../../actions';
import { useRouter } from 'next/navigation';

export default function NewVoucherForm({ clients, suppliers, items, tenantId }: { clients: any[], suppliers: any[], items: any[], tenantId: string }) {
  const router = useRouter();
  const [invoiceCategory, setInvoiceCategory] = useState<'Sale' | 'Purchase'>('Sale');
  const [clientId, setClientId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [invoiceType, setInvoiceType] = useState('Sale Invoice');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  
  const [fbrOptions, setFbrOptions] = useState<any>({ documentTypes: [], saleTypes: [], petroleumLevyOn: [], rates: [], sros: [], itemSrNos: [] });
  const [lineItems, setLineItems] = useState<any[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const defaultCurrentItem = {
    itemId: '', hsCode: '', productDescription: '', rate: '18%', uoM: 'NOS', 
    quantity: 1, price: 0, fixedValue: 0, furtherTax: 0, 
    saleType: 'Goods at standard rate (default)', sroScheduleNo: '', 
    sroItemSerialNo: '', petroleumLevyOn: ''
  };
  const [currentItem, setCurrentItem] = useState<any>(defaultCurrentItem);

  React.useEffect(() => {
    getFbrDropdownOptions().then(setFbrOptions);
  }, []);

  const handleOpenModal = (index: number | null = null) => {
    if (index !== null) {
      setEditingIndex(index);
      setCurrentItem(lineItems[index]);
    } else {
      setEditingIndex(null);
      if (items.length > 0) {
        const defaultItem = items[0];
        setCurrentItem({
          itemId: defaultItem.id, hsCode: defaultItem.hsCode, productDescription: defaultItem.productDescription,
          rate: defaultItem.rate, uoM: defaultItem.uoM, quantity: 1, price: defaultItem.unitPrice || 0,
          fixedValue: defaultItem.fixedNotifiedValueOrRetailPrice || 0, furtherTax: 0,
          saleType: defaultItem.saleType || 'Goods at standard rate (default)', sroScheduleNo: defaultItem.sroScheduleNo || '',
          sroItemSerialNo: defaultItem.sroItemSerialNo || '', petroleumLevyOn: defaultItem.petroleumLevyOn || ''
        });
      } else {
        setCurrentItem(defaultCurrentItem);
      }
    }
    setIsModalOpen(true);
  };

  const updateCurrentItem = (field: string, value: any) => {
    if (field === 'itemId') {
      const selectedDef = items.find(i => i.id === value);
      if (!selectedDef) return;
      setCurrentItem({
        ...currentItem,
        itemId: value, hsCode: selectedDef.hsCode, productDescription: selectedDef.productDescription,
        rate: selectedDef.rate, uoM: selectedDef.uoM, price: selectedDef.unitPrice || 0,
        fixedValue: selectedDef.fixedNotifiedValueOrRetailPrice || 0,
        saleType: selectedDef.saleType || 'Goods at standard rate (default)',
        sroScheduleNo: selectedDef.sroScheduleNo || '', sroItemSerialNo: selectedDef.sroItemSerialNo || '',
        petroleumLevyOn: selectedDef.petroleumLevyOn || ''
      });
    } else {
      setCurrentItem({ ...currentItem, [field]: value });
    }
  };

  const handleSaveItem = (addAnother: boolean) => {
    if (!currentItem.itemId) {
      alert("Please select an item.");
      return;
    }
    
    if (editingIndex !== null) {
      const updated = [...lineItems];
      updated[editingIndex] = currentItem;
      setLineItems(updated);
    } else {
      setLineItems([...lineItems, currentItem]);
    }
    
    if (addAnother) {
      setEditingIndex(null);
      if (items.length > 0) {
        const defaultItem = items[0];
        setCurrentItem({
          itemId: defaultItem.id, hsCode: defaultItem.hsCode, productDescription: defaultItem.productDescription,
          rate: defaultItem.rate, uoM: defaultItem.uoM, quantity: 1, price: defaultItem.unitPrice || 0,
          fixedValue: defaultItem.fixedNotifiedValueOrRetailPrice || 0, furtherTax: 0,
          saleType: defaultItem.saleType || 'Goods at standard rate (default)', sroScheduleNo: defaultItem.sroScheduleNo || '',
          sroItemSerialNo: defaultItem.sroItemSerialNo || '', petroleumLevyOn: defaultItem.petroleumLevyOn || ''
        });
      }
    } else {
      setIsModalOpen(false);
    }
  };

  const removeItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const getTaxRateDecimal = (rateStr: string) => {
    let val = parseFloat(rateStr.replace('%', '')) || 0;
    return val > 1 ? val / 100 : val;
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let tax = 0;
    let furtherTaxTotal = 0;
    lineItems.forEach(item => {
      const is3rd = item.saleType?.toLowerCase().includes('3rd schedule');
      const lineSub = item.quantity * item.price;
      subtotal += lineSub;
      const taxBase = is3rd ? (item.quantity * (item.fixedValue || 0)) : lineSub;
      tax += taxBase * getTaxRateDecimal(item.rate);
      furtherTaxTotal += Number(item.furtherTax) || 0;
    });
    return { subtotal, tax, furtherTaxTotal, total: subtotal + tax + furtherTaxTotal };
  };

  const totals = calculateTotals();

  const handleSave = async (status: string) => {
    const isPurchaseCat = invoiceCategory === 'Purchase';
    if ((isPurchaseCat && !supplierId) || (!isPurchaseCat && !clientId) || !invoiceDate || lineItems.length === 0) {
      alert("Please fill in all required fields and add at least one item.");
      return;
    }

    if (invoiceType === 'Sale Invoice') {
      for (const li of lineItems) {
        const stock = items.find(i => i.id === li.itemId)?.currentStock || 0;
        if (li.quantity > stock) {
          alert(`Quantity for item ${li.productDescription} exceeds available stock (${stock}).`);
          return;
        }
      }
    }

    const payload = {
      tenantId,
      clientId: isPurchaseCat ? null : clientId,
      supplierId: isPurchaseCat ? supplierId : null,
      invoiceType,
      invoiceDate: new Date(invoiceDate),
      invoiceRefNo: referenceNo || null,
      status: status,
      items: {
        create: lineItems.map(li => {
          const is3rd = li.saleType?.toLowerCase().includes('3rd schedule');
          const lineSub = li.quantity * li.price;
          const taxBase = is3rd ? (li.quantity * (li.fixedValue || 0)) : lineSub;
          const lineTax = taxBase * getTaxRateDecimal(li.rate);
          return {
            itemCode: items.find(i => i.id === li.itemId)?.itemCode || '',
            hsCode: li.hsCode,
            productDescription: li.productDescription,
            rate: li.rate,
            uoM: li.uoM,
            quantity: Number(li.quantity),
            valueSalesExcludingST: lineSub,
            totalValues: lineSub + lineTax,
            fixedNotifiedValueOrRetailPrice: Number(li.fixedValue || 0),
            salesTaxApplicable: lineTax,
            saleType: li.saleType,
            sroScheduleNo: li.sroScheduleNo || null,
            sroItemSerialNo: li.sroItemSerialNo || null,
            petroleumLevyOn: li.petroleumLevyOn || null
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
    <>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Invoice Category *</label>
              <select value={invoiceCategory} onChange={e => {
                setInvoiceCategory(e.target.value as 'Sale' | 'Purchase');
                setInvoiceType(e.target.value === 'Purchase' ? 'Purchase Invoice' : 'Sale Invoice');
              }} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                <option value="Sale">Sale (Outflow)</option>
                <option value="Purchase">Purchase (Inflow)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">{invoiceCategory === 'Sale' ? 'Client / Buyer *' : 'Supplier / Vendor *'}</label>
              {invoiceCategory === 'Sale' ? (
                <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                  <option value="">Select a registered client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.buyerBusinessName} ({c.buyerRegistrationType})</option>
                  ))}
                </select>
              ) : (
                <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                  <option value="">Select a registered supplier...</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.sellerBusinessName} ({s.sellerRegistrationType})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Invoice Type (Document Type) *</label>
              <select value={invoiceType} onChange={e => setInvoiceType(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                {invoiceCategory === 'Sale' ? (
                  <>
                    <option value="Sale Invoice">Sale Invoice</option>
                    <option value="Credit Note">Credit Note (Sale Return)</option>
                  </>
                ) : (
                  <>
                    <option value="Purchase Invoice">Purchase Invoice</option>
                    <option value="Debit Note">Debit Note (Purchase Return)</option>
                  </>
                )}
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
            <button type="button" onClick={() => handleOpenModal(null)} className="flex items-center gap-1.5 text-sm font-bold text-emerald-500 hover:text-emerald-400">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          {/* Summarized View Table */}
          <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-950">
            <table className="w-full text-left text-sm">
              <thead className="uppercase tracking-wider border-b border-neutral-800 text-neutral-400 bg-neutral-900/50 text-xs">
                <tr>
                  <th className="px-4 py-3 font-medium">Sr#</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium text-right">Qty</th>
                  <th className="px-4 py-3 font-medium text-right">Unit Price</th>
                  <th className="px-4 py-3 font-medium text-right">Tax%</th>
                  <th className="px-4 py-3 font-medium text-right">Total Amount</th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {lineItems.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-6 text-neutral-500">No items added. Click 'Add Item' to start.</td></tr>
                )}
                {lineItems.map((li, idx) => {
                  const is3rd = li.saleType?.toLowerCase().includes('3rd schedule');
                  const lineSub = li.quantity * li.price;
                  const taxBase = is3rd ? (li.quantity * (li.fixedValue || 0)) : lineSub;
                  const lineTax = taxBase * getTaxRateDecimal(li.rate);
                  const total = lineSub + lineTax + (Number(li.furtherTax) || 0);

                  return (
                    <tr key={idx} className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-4 py-3 text-neutral-500">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-white">{li.productDescription}</td>
                      <td className="px-4 py-3 text-right text-neutral-300">{li.quantity} <span className="text-xs text-neutral-500">{li.uoM}</span></td>
                      <td className="px-4 py-3 text-right font-mono text-neutral-300">{li.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td className="px-4 py-3 text-right text-neutral-400">
                        {String(li.rate).includes('%') ? li.rate : !isNaN(Number(li.rate)) ? `${Number(li.rate) * 100}%` : li.rate}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-500">{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button type="button" onClick={() => handleOpenModal(idx)} className="text-emerald-500 hover:text-emerald-400 p-1.5 bg-neutral-900 rounded-md transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => removeItem(idx)} className="text-rose-500 hover:text-rose-400 p-1.5 bg-neutral-900 rounded-md transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              <div className="flex justify-between text-sm text-neutral-400">
                <span>Further Tax</span>
                <span className="font-mono text-white">{totals.furtherTaxTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
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
          {invoiceCategory === 'Sale' ? (
            <>
              <button type="button" onClick={() => handleSave('DRAFT')} className="px-8 py-3 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-white font-bold transition-all">
                Save Draft
              </button>
              <button type="button" onClick={() => handleSave('PENDING_FBR')} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-8 py-3 rounded-xl font-bold transition-all transform active:scale-[0.98]">
                <ShieldCheck className="w-5 h-5" />
                Post to FBR
              </button>
            </>
          ) : (
            <button type="button" onClick={() => handleSave('VALID')} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-8 py-3 rounded-xl font-bold transition-all transform active:scale-[0.98]">
              <Save className="w-5 h-5" />
              Save to Database
            </button>
          )}
        </div>
      </form>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl my-auto shadow-2xl overflow-hidden flex flex-col max-h-full">
            
            <div className="flex items-center justify-between p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
              <h3 className="text-xl font-bold text-white">
                {editingIndex !== null ? 'Edit Item' : 'Add Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white transition-colors bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Core Item Info */}
                <div className="space-y-4 md:col-span-2">
                  <h4 className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Item Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-neutral-300">Product / Item *</label>
                      <select 
                        value={currentItem.itemId} 
                        onChange={e => updateCurrentItem('itemId', e.target.value)} 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        {items.length === 0 && <option value="">No items available...</option>}
                        {items.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.productDescription} (HS: {item.hsCode})
                          </option>
                        ))}
                      </select>
                      {invoiceType === 'Sale Invoice' && currentItem.itemId && (
                        <div className="text-xs text-neutral-400 flex justify-between px-1 mt-1">
                          <span>Current Stock:</span>
                          <span className={currentItem.quantity > (items.find((i: any) => i.id === currentItem.itemId)?.currentStock || 0) ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                            {items.find((i: any) => i.id === currentItem.itemId)?.currentStock || 0}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Quantity *</label>
                      <input 
                        type="number" min="1" 
                        value={currentItem.quantity} 
                        onChange={e => updateCurrentItem('quantity', Number(e.target.value))} 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Unit Price (PKR) *</label>
                      <input 
                        type="number" min="0" step="0.01"
                        value={currentItem.price} 
                        onChange={e => updateCurrentItem('price', Number(e.target.value))} 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 my-2 border-t border-neutral-800/50"></div>

                {/* Tax & FBR Details */}
                <div className="space-y-4 md:col-span-2">
                  <h4 className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Tax & FBR Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Tax Rate %</label>
                      <select 
                        value={currentItem.rate} 
                        onChange={e => updateCurrentItem('rate', e.target.value)} 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        {fbrOptions.rates?.length > 0 ? (
                          fbrOptions.rates.map((r: string) => <option key={r} value={r}>{Number(r) * 100}%</option>)
                        ) : (
                          <option value={currentItem.rate}>
                            {String(currentItem.rate).includes('%') ? currentItem.rate : !isNaN(Number(currentItem.rate)) ? `${Number(currentItem.rate) * 100}%` : currentItem.rate}
                          </option>
                        )}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Further Tax (PKR)</label>
                      <input 
                        type="number" min="0" 
                        value={currentItem.furtherTax} 
                        onChange={e => updateCurrentItem('furtherTax', Number(e.target.value))} 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-neutral-300">Sale Type (Required for FBR)</label>
                      <select 
                        value={currentItem.saleType} 
                        onChange={e => updateCurrentItem('saleType', e.target.value)} 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        {fbrOptions.saleTypes?.length > 0 ? (
                          fbrOptions.saleTypes.map((t: string) => <option key={t} value={t}>{t}</option>)
                        ) : (
                          <option value="Goods at standard rate (default)">Goods at standard rate</option>
                        )}
                      </select>
                    </div>

                    {currentItem.saleType?.toLowerCase().includes('3rd schedule') && (
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-amber-500">3rd Schedule Fixed Value (PKR) *</label>
                        <input 
                          type="number" min="0" 
                          value={currentItem.fixedValue} 
                          onChange={e => updateCurrentItem('fixedValue', Number(e.target.value))} 
                          className="w-full bg-amber-950/20 border border-amber-500/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                        />
                        <p className="text-xs text-neutral-500">Required because "3rd Schedule" sale type is selected.</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">SRO / Schedule No.</label>
                      <select 
                        value={currentItem.sroScheduleNo} 
                        onChange={e => updateCurrentItem('sroScheduleNo', e.target.value)} 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        <option value="">None</option>
                        {fbrOptions.sros?.map((sro: string) => <option key={sro} value={sro}>{sro}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Item Serial No.</label>
                      <select 
                        value={currentItem.sroItemSerialNo} 
                        onChange={e => updateCurrentItem('sroItemSerialNo', e.target.value)} 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      >
                        <option value="">None</option>
                        {fbrOptions.itemSrNos?.map((no: string) => <option key={no} value={no}>{no}</option>)}
                      </select>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-800 bg-neutral-900 sticky bottom-0 z-10 flex items-center justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-neutral-400 hover:text-white font-medium transition-colors">
                Cancel
              </button>
              
              <button onClick={() => handleSaveItem(true)} className="px-6 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-white font-bold transition-colors hidden md:block">
                Save & Add Another
              </button>

              <button onClick={() => handleSaveItem(false)} className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-colors">
                Save & Finish
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
