import React from 'react';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="text-white font-sans p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <Settings className="w-7 h-7 text-emerald-500" />
            Platform Settings
          </h1>
          <p className="text-neutral-400">Configure global application variables and third-party integrations.</p>
        </div>
      </header>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Payment Gateway Integration</h2>
        <p className="text-neutral-400 mb-6">Connect your local payment processor (JazzCash, PayFast, Stripe) to automate subscription renewals. (Module pending activation)</p>
        
        <button disabled className="bg-neutral-800 text-neutral-500 px-6 py-2 rounded-xl font-bold cursor-not-allowed">
          Configure Payment Gateway
        </button>
      </div>
    </div>
  );
}
