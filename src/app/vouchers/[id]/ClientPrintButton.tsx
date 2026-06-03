'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function ClientPrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all transform active:scale-[0.98] border border-neutral-700"
    >
      <Printer className="w-4 h-4" />
      Print / Save as PDF
    </button>
  );
}
