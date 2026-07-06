'use client';

import { useState } from 'react';

export default function ImpersonationBanner({ userName }: { userName: string }) {
  const [loading, setLoading] = useState(false);

  const handleStop = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stop-impersonate', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/admin/audit-logs'; // Force full reload to admin area
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="font-semibold text-sm">
        ⚠️ You are currently impersonating <span className="font-bold underline">{userName}</span>. All actions are logged.
      </div>
      <button 
        onClick={handleStop}
        disabled={loading}
        className="bg-white text-red-600 px-4 py-1.5 rounded text-sm font-bold shadow-sm hover:bg-gray-100 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Stopping...' : 'Return to Admin Panel'}
      </button>
    </div>
  );
}
