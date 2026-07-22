'use client';

import React, { useState, useMemo } from 'react';
import { Receipt, Search, CheckCircle, Clock, XCircle, Download } from 'lucide-react';
import Link from 'next/link';
import { postDraftToFBR, deleteInvoice } from '../actions';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

export default function VoucherList({ invoices }: { invoices: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState(''); // YYYY-MM
  const [filterDate, setFilterDate] = useState(''); // YYYY-MM-DD
  const [filterType, setFilterType] = useState('ALL'); // ALL, Sale, Purchase
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this voucher? This action cannot be undone.")) {
      try {
        await deleteInvoice(id);
        alert("Voucher deleted successfully.");
      } catch (err: any) {
        alert(err.message || "Failed to delete voucher.");
      }
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((v: any) => {
      // 1. Search (ID, Name, NTN/CNIC)
      const query = searchTerm.toLowerCase();
      const voucherIdStr = v.voucherNumber && v.voucherNumber > 0 
        ? `vou-${String(v.voucherNumber).padStart(4, '0')}` 
        : `vou-${v.id.substring(1,7).toLowerCase()}`;
      
      const clientName = (v.client?.buyerBusinessName || v.supplier?.sellerBusinessName || '').toLowerCase();
      const cnicNtn = (v.client?.buyerNTNCNIC || v.supplier?.sellerNTNCNIC || '').toLowerCase();

      const matchesSearch = 
        !query || 
        voucherIdStr.includes(query) || 
        clientName.includes(query) || 
        cnicNtn.includes(query);

      // 2. Filter by Type
      const matchesType = filterType === 'ALL' || v.invoiceType === filterType;

      // 3. Filter by Exact Date
      let matchesDate = true;
      if (filterDate) {
        const vDate = new Date(v.invoiceDate).toISOString().split('T')[0];
        matchesDate = vDate === filterDate;
      }

      // 4. Filter by Month/Year
      let matchesMonth = true;
      if (filterMonth && !filterDate) {
        const vMonth = new Date(v.invoiceDate).toISOString().slice(0, 7); // YYYY-MM
        matchesMonth = vMonth === filterMonth;
      }

      return matchesSearch && matchesType && matchesDate && matchesMonth;
    });
  }, [invoices, searchTerm, filterMonth, filterDate, filterType]);

  const handleDownloadExcel = () => {
    // Transform filtered invoices to excel rows
    const excelData = filteredInvoices.map(v => ({
      'Voucher ID': v.voucherNumber && v.voucherNumber > 0 
        ? `VOU-${String(v.voucherNumber).padStart(4, '0')}` 
        : `VOU-${v.id.substring(1,7).toUpperCase()}`,
      'Type': v.invoiceType,
      'Client / Supplier Name': v.client?.buyerBusinessName || v.supplier?.sellerBusinessName || 'N/A',
      'NTN / CNIC': v.client?.buyerNTNCNIC || v.supplier?.sellerNTNCNIC || 'N/A',
      'Total Amount': v.totalAmount || 0,
      'Date': new Date(v.invoiceDate).toLocaleDateString(),
      'Status': v.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vouchers");
    
    // Download
    XLSX.writeFile(workbook, `Vouchers_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-3" />
          <input 
            type="text" 
            placeholder="Search by ID, Name, or NTN/CNIC..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
        >
          <option value="ALL">All Types</option>
          <option value="Sale Invoice">Sale</option>
          <option value="Purchase Invoice">Purchase</option>
        </select>

        <input 
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          title="Filter by Month"
        />

        <input 
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          title="Filter by Exact Date (Overrides Month)"
        />

        <button 
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all"
        >
          <Download className="w-4 h-4" />
          Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="uppercase tracking-wider border-b border-neutral-800 text-neutral-400">
            <tr>
              <th className="px-4 py-4 font-medium">Voucher ID</th>
              <th className="px-4 py-4 font-medium">Client / Supplier</th>
              <th className="px-4 py-4 font-medium">Type</th>
              <th className="px-4 py-4 font-medium">Total Amount</th>
              <th className="px-4 py-4 font-medium">Date</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {filteredInvoices.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-neutral-500">No vouchers found.</td></tr>
            )}
            {filteredInvoices.map((v: any) => (
              <tr key={v.id} className="hover:bg-neutral-800/20 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center border border-neutral-700">
                      <Receipt className="w-4 h-4 text-neutral-400" />
                    </div>
                    <span className="font-semibold text-white">
                      {v.voucherNumber && v.voucherNumber > 0 
                        ? `VOU-${String(v.voucherNumber).padStart(4, '0')}` 
                        : `VOU-${v.id.substring(1,7).toUpperCase()}`}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-neutral-300">
                  <div className="flex flex-col">
                    <span>{v.client?.buyerBusinessName || v.supplier?.sellerBusinessName || 'N/A'} {v.supplier && <span className="ml-2 inline-block text-[10px] uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Vendor</span>}</span>
                    <span className="text-xs text-neutral-500 font-mono mt-0.5">{v.client?.buyerNTNCNIC || v.supplier?.sellerNTNCNIC}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-neutral-400">{v.invoiceType}</td>
                <td className="px-4 py-4 font-mono font-medium text-emerald-500">{v.totalAmount ? `Rs ${v.totalAmount.toLocaleString()}` : '-'}</td>
                <td className="px-4 py-4 text-neutral-400">{new Date(v.invoiceDate).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  {v.status === 'VALID' && <span className="flex items-center gap-1.5 text-emerald-500 font-medium"><CheckCircle className="w-4 h-4" /> Valid</span>}
                  {(v.status === 'PENDING_FBR' || v.status === 'DRAFT') && <span className="flex items-center gap-1.5 text-amber-500 font-medium"><Clock className="w-4 h-4" /> {v.status}</span>}
                  {(v.status === 'INVALID' || v.status === 'FAILED_CONNECTION') && <span className="flex items-center gap-1.5 text-rose-500 font-medium"><XCircle className="w-4 h-4" /> {v.status}</span>}
                </td>
                <td className="px-4 py-4 text-right space-x-3">
                  {v.status === 'DRAFT' && (
                    <form action={postDraftToFBR.bind(null, v.id)} className="inline">
                      <button type="submit" className="text-amber-500 font-medium hover:text-amber-400 mr-3">Post to FBR</button>
                    </form>
                  )}
                  {(v.status === 'DRAFT' || v.status === 'PENDING_APPROVAL' || v.invoiceType === 'Purchase Invoice') && (
                    <>
                      <Link href={`/vouchers/${v.id}/edit`} className="text-blue-500 font-medium hover:underline mr-3">Edit</Link>
                      <button onClick={() => handleDelete(v.id)} className="text-red-500 font-medium hover:underline mr-3">Delete</button>
                    </>
                  )}
                  <Link href={`/vouchers/${v.id}`} className="text-emerald-500 font-medium hover:underline">View PDF</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
