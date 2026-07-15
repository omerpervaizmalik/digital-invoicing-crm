'use client';

import React, { useRef, useState } from 'react';
import { Upload, Download, FileSpreadsheet, FileDown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { bulkUploadItems } from '../actions';

interface ImportExportButtonsProps {
  items: any[];
}

export default function ImportExportButtons({ items }: ImportExportButtonsProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        if (!bstr) {
          throw new Error("Could not read file data.");
        }
        
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json<any>(ws);

        if (rawData.length === 0) {
          alert("The uploaded Excel sheet is empty.");
          setIsUploading(false);
          return;
        }

        // Map spreadsheet columns to database model fields
        const itemsToUpload = rawData.map((row: any) => {
          const getValue = (possibleNames: string[], defaultValue = '') => {
            for (const name of possibleNames) {
              if (row[name] !== undefined) return row[name];
              const keyFound = Object.keys(row).find(
                k => k.toLowerCase().replace(/\s+/g, '') === name.toLowerCase().replace(/\s+/g, '')
              );
              if (keyFound) return row[keyFound];
            }
            return defaultValue;
          };

          const itemCode = String(getValue(['Product Code', 'itemCode', 'code']) || '').trim();
          const productDescription = String(getValue(['Product Description', 'productDescription', 'description', 'desc']) || '').trim();
          const hsCode = String(getValue(['HS Code', 'hsCode', 'hscode']) || '').trim();
          
          let rateVal = String(getValue(['Sales Tax Rate', 'rate', 'salesTaxRate', 'taxRate']) || '0.18').trim();
          // Convert percentage string or integers to decimals (e.g. 18% or 18 -> 0.18)
          if (rateVal.endsWith('%')) {
            rateVal = String(parseFloat(rateVal) / 100);
          } else if (parseFloat(rateVal) > 1) {
            rateVal = String(parseFloat(rateVal) / 100);
          }

          const uoM = String(getValue(['UOM', 'uoM', 'unitOfMeasure', 'unit']) || 'Numbers, pieces, units').trim();
          const unitPrice = getValue(['Unit Price', 'unitPrice', 'price'], '0');
          const fixedNotifiedValueOrRetailPrice = getValue(['Retail Price', 'retailPrice', 'fixedValue', 'fixedNotifiedValueOrRetailPrice'], '0');
          const initialStock = getValue(['Initial Stock Quantity', 'initialQty', 'initialStock', 'quantity', 'qty'], '0');
          const initialStockValue = getValue(['Initial Stock Total Value', 'initialVal', 'initialStockValue', 'value'], '0');
          
          const saleType = String(getValue(['Sale Type', 'saleType', 'type'], 'Goods at standard rate (default)')).trim();
          const sroScheduleNo = String(getValue(['SRO Schedule No', 'sroScheduleNo', 'sroNo', 'scheduleNo']) || '').trim();
          const sroItemSerialNo = String(getValue(['SRO Item Serial No', 'sroItemSerialNo', 'itemSrNo', 'serialNo']) || '').trim();
          const petroleumLevyOn = String(getValue(['Petroleum Levy On', 'petroleumLevyOn']) || '').trim();

          return {
            itemCode,
            productDescription,
            hsCode,
            rate: rateVal,
            uoM,
            unitPrice,
            fixedNotifiedValueOrRetailPrice,
            initialStock,
            initialStockValue,
            saleType,
            sroScheduleNo: sroScheduleNo || null,
            sroItemSerialNo: sroItemSerialNo || null,
            petroleumLevyOn: petroleumLevyOn || null
          };
        });

        // Call the server action
        const res = await bulkUploadItems(itemsToUpload);
        let msg = `Upload complete!\nCreated: ${res.created} products.\nUpdated: ${res.updated} products.`;
        if (res.errors.length > 0) {
          msg += `\n\nErrors encountered:\n` + res.errors.slice(0, 5).join('\n');
          if (res.errors.length > 5) {
            msg += `\n...and ${res.errors.length - 5} more errors.`;
          }
        }
        alert(msg);
        router.refresh();
      } catch (error: any) {
        console.error(error);
        alert("Error parsing Excel file: " + (error.message || error));
      } finally {
        setIsUploading(false);
        if (e.target) e.target.value = ''; // Reset input
      }
    };

    reader.onerror = () => {
      alert("Error reading file.");
      setIsUploading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Product Code': 'PRD-001',
        'Product Description': 'Agricultural Machinery Parts',
        'HS Code': '8432.9010',
        'Sales Tax Rate': '0.18',
        'UOM': 'Numbers, pieces, units',
        'Unit Price': 12500,
        'Retail Price': 0,
        'Initial Stock Quantity': 50,
        'Initial Stock Total Value': 625000,
        'Sale Type': 'Goods at standard rate (default)',
        'SRO Schedule No': '',
        'SRO Item Serial No': '',
        'Petroleum Levy On': ''
      },
      {
        'Product Code': 'PRD-002',
        'Product Description': 'Iron Castings',
        'HS Code': '7325.1000',
        'Sales Tax Rate': '0.18',
        'UOM': 'KG',
        'Unit Price': 450,
        'Retail Price': 0,
        'Initial Stock Quantity': 1000,
        'Initial Stock Total Value': 450000,
        'Sale Type': 'Goods at standard rate (default)',
        'SRO Schedule No': '',
        'SRO Item Serial No': '',
        'Petroleum Levy On': ''
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Template');
    
    // Auto-fit column widths for readability
    const maxLens = Object.keys(templateData[0]).map(key => Math.max(key.length, 12));
    worksheet['!cols'] = maxLens.map(len => ({ wch: len + 3 }));

    XLSX.writeFile(workbook, 'product_upload_template.xlsx');
  };

  const handleExportCatalog = () => {
    if (items.length === 0) {
      alert("There are no products in the catalog to export.");
      return;
    }

    const dataToExport = items.map(item => ({
      'Product Code': item.itemCode,
      'Product Description': item.productDescription,
      'HS Code': item.hsCode,
      'Sales Tax Rate': item.rate,
      'UOM': item.uoM,
      'Unit Price': item.unitPrice,
      'Retail Price': item.fixedNotifiedValueOrRetailPrice,
      'Current Stock': item.currentStock || 0,
      'Sale Type': item.saleType,
      'SRO Schedule No': item.sroScheduleNo || '',
      'SRO Item Serial No': item.sroItemSerialNo || '',
      'Petroleum Levy On': item.petroleumLevyOn || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    // Auto-fit column widths
    const maxLens = Object.keys(dataToExport[0]).map(key => Math.max(key.length, 12));
    worksheet['!cols'] = maxLens.map(len => ({ wch: len + 3 }));

    XLSX.writeFile(workbook, 'products_catalog.xlsx');
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".xlsx, .xls, .csv" 
        className="hidden" 
      />

      <button
        onClick={handleDownloadTemplate}
        type="button"
        className="flex items-center gap-2 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all transform active:scale-[0.98]"
        title="Download Excel Template to populate data"
      >
        <FileDown className="w-4 h-4 text-emerald-500" />
        Download Template
      </button>

      <button
        onClick={handleExportCatalog}
        type="button"
        className="flex items-center gap-2 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all transform active:scale-[0.98]"
        title="Export all catalog products to Excel"
      >
        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
        Export Catalog
      </button>

      <button
        onClick={handleUploadClick}
        type="button"
        disabled={isUploading}
        className="flex items-center gap-2 border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 hover:text-emerald-300 disabled:opacity-50 px-4 py-2.5 rounded-xl font-bold text-sm transition-all transform active:scale-[0.98]"
        title="Upload filled Excel template"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload Products
          </>
        )}
      </button>
    </div>
  );
}
