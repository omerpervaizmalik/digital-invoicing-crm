'use client';

import React from 'react';
import { Download } from 'lucide-react';

export default function ExportButton({ data, month }: { data: any[], month: string }) {
  
  const handleExport = () => {
    // Generate CSV Headers mapping to the flat output needed by IRIS
    const headers = [
      "Sr. No.", "HS Code", "UoM", "Tax Rate", 
      "Opening Value", "Opening Qty", 
      "Purchased Value", "Purchased Qty", 
      "Dom. Taxable Value", "Dom. Taxable Qty",
      "Exempt Value", "Exempt Qty",
      "Zero Rated Value", "Zero Rated Qty",
      "Closing Value", "Closing Qty"
    ];

    const rows = data.map((row, idx) => [
      idx + 1,
      `"${row.hsCode}"`,
      `"${row.uoM}"`,
      row.salesTaxRate,
      row.openingVal, row.openingQty,
      row.purchasedVal, row.purchasedQty,
      row.domesticTaxableVal, row.domesticTaxableQty,
      row.exemptVal, row.exemptQty,
      row.zeroRatedVal, row.zeroRatedQty,
      row.closingVal, row.closingQty
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `FBR_Stock_Register_${month}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-4 py-2 rounded-lg text-sm font-bold transition-all transform active:scale-[0.98]"
    >
      <Download className="w-4 h-4" /> Export CSV
    </button>
  );
}
