'use client';

import React, { useState } from 'react';
import { CopyPlus, Loader2 } from 'lucide-react';
import { loadPreviousMonthStock } from '../actions';
import { useRouter } from 'next/navigation';

export default function LoadPreviousMonthButton({ tenantId, currentMonth }: { tenantId: string, currentMonth: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLoad = async () => {
    if (!confirm('Are you sure you want to load opening balances from the previous month? This will override any manually entered opening balances for this month.')) {
      return;
    }
    
    setLoading(true);
    const result = await loadPreviousMonthStock(tenantId, currentMonth);
    setLoading(false);

    if (result?.success) {
      alert('Stock successfully loaded from previous month.');
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
      title="Load previous month closing balance as current month opening balance"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CopyPlus className="w-4 h-4" />}
      Load Prev. Month
    </button>
  );
}
