'use client';

import React, { useState } from 'react';
import { CopyPlus, Loader2 } from 'lucide-react';
import { loadPreviousMonthStock } from '../actions';
import { useRouter } from 'next/navigation';

export default function LoadPreviousMonthButton({ tenantId, currentMonth }: { tenantId: string, currentMonth: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLoad = async () => {
    if (!confirm('Are you sure you want to sync stocks from all previous months? This will recalculate balances chronologically up to this month.')) {
      return;
    }
    
    setLoading(true);
    const result = await loadPreviousMonthStock(tenantId, currentMonth);
    setLoading(false);

    if (result?.success) {
      alert('Stock successfully synchronized from past months.');
      router.refresh();
    } else {
      alert(`Error: ${result?.error}`);
    }
  };

  return (
    <button 
      onClick={handleLoad}
      disabled={loading}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      title="Synchronize and cascade all past stock balances up to the current month"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CopyPlus className="w-4 h-4" />}
      Sync Past Stocks
    </button>
  );
}
