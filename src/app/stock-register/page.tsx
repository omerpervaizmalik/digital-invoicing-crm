import React from 'react';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Package, Download, Search } from 'lucide-react';
import ExportButton from './ExportButton';
import AddStockModal from './AddStockModal';

const prisma = new PrismaClient();

export default async function StockRegisterPage({
  searchParams
}: {
  searchParams: Promise<{ month?: string; search?: string }>
}) {
  const resolvedParams = await searchParams;
  const currentMonth = resolvedParams.month || new Date().toISOString().slice(0, 7);
  const searchQuery = resolvedParams.search || '';

  // In reality, this would fetch the logged in tenant's ID
  const tenant = await prisma.tenant.findFirst();

  let stockData: any[] = [];
  if (tenant) {
    stockData = await prisma.stockRegister.findMany({
      where: {
        tenantId: tenant.id,
        monthYear: currentMonth,
        hsCode: { contains: searchQuery }
      },
      orderBy: { hsCode: 'asc' }
    });
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black mb-2">FBR Stock Register</h1>
            <p className="text-neutral-400">Monthly inventory tracking for tax compliance.</p>
          </div>
          <div className="flex gap-4">
            <form className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input 
                  type="text" 
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search HS Code..."
                  className="bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <input 
                type="month" 
                name="month"
                defaultValue={currentMonth}
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button type="submit" className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Filter</button>
            </form>
            {tenant && <AddStockModal tenantId={tenant.id} monthYear={currentMonth} />}
            <ExportButton data={stockData} month={currentMonth} />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th rowSpan={2} className="px-4 py-3 border-r border-neutral-800 font-medium text-center bg-neutral-900/50">Sr. No.</th>
                  <th colSpan={3} className="px-4 py-3 border-r border-neutral-800 font-medium text-center bg-neutral-900/50">Item Details</th>
                  <th colSpan={2} className="px-4 py-3 border-r border-neutral-800 font-medium text-center bg-neutral-900/50">Opening Balance</th>
                  <th colSpan={2} className="px-4 py-3 border-r border-neutral-800 font-medium text-center bg-neutral-900/50">Purchased / Imported during month</th>
                  <th colSpan={6} className="px-4 py-3 border-r border-neutral-800 font-medium text-center bg-neutral-900/50">Goods Supplied During the Month</th>
                  <th colSpan={2} className="px-4 py-3 font-medium text-center bg-neutral-900/50">Closing Balance</th>
                </tr>
                <tr className="text-xs uppercase tracking-wider bg-neutral-950/80">
                  {/* Item Details */}
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium">HS Code</th>
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-center">UoM</th>
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right">Tax Rate</th>
                  
                  {/* Opening */}
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-emerald-500/80">Value</th>
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-emerald-500/80">Qty</th>
                  
                  {/* Purchased */}
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-blue-500/80">Value</th>
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-blue-500/80">Qty</th>
                  
                  {/* Supplied: Domestic */}
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-amber-500/80">Dom. Taxable Val</th>
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-amber-500/80">Qty</th>
                  
                  {/* Supplied: Exempt */}
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-purple-500/80">Exempt Val</th>
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-purple-500/80">Qty</th>
                  
                  {/* Supplied: Zero Rated */}
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-rose-500/80">Zero Rated Val</th>
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-rose-500/80">Qty</th>
                  
                  {/* Closing */}
                  <th className="px-4 py-2 border-r border-t border-neutral-800 font-medium text-right text-emerald-400">Value</th>
                  <th className="px-4 py-2 border-t border-neutral-800 font-medium text-right text-emerald-400">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {stockData.length === 0 ? (
                  <tr>
                    <td colSpan={18} className="px-4 md:px-6 py-8 md:py-12 text-center text-neutral-500">
                      No stock data recorded for {currentMonth}. Creates invoices or purchases to populate the register.
                    </td>
                  </tr>
                ) : (
                  stockData.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-3 border-r border-neutral-800 text-center text-neutral-500">{idx + 1}</td>
                      <td className="px-4 py-3 border-r border-neutral-800 font-mono text-neutral-300">{row.hsCode}</td>
                      <td className="px-4 py-3 border-r border-neutral-800 text-center text-neutral-400">{row.uoM}</td>
                      <td className="px-4 py-3 border-r border-neutral-800 text-right text-neutral-400">
                        {row.salesTaxRate * 100}%
                      </td>
                      
                      {/* Opening */}
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono text-emerald-500/70">{row.openingVal.toLocaleString()}</td>
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono text-emerald-500/70">{row.openingQty}</td>
                      
                      {/* Purchased */}
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono text-blue-500/70">{row.purchasedVal.toLocaleString()}</td>
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono text-blue-500/70">{row.purchasedQty}</td>
                      
                      {/* Supplied Domestic */}
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono text-amber-500/70">{row.domesticTaxableVal.toLocaleString()}</td>
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono text-amber-500/70">{row.domesticTaxableQty}</td>
                      
                      {/* Supplied Exempt */}
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono text-purple-500/70">{row.exemptVal.toLocaleString()}</td>
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono text-purple-500/70">{row.exemptQty}</td>
                      
                      {/* Supplied Zero Rated */}
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono text-rose-500/70">{row.zeroRatedVal.toLocaleString()}</td>
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono text-rose-500/70">{row.zeroRatedQty}</td>
                      
                      {/* Closing */}
                      <td className="px-4 py-3 border-r border-neutral-800 text-right font-mono font-bold text-emerald-400">{row.closingVal.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">{row.closingQty}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
