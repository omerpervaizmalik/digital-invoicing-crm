'use client';

import { useState } from 'react';

export function ImpersonateButton({ userId, userName }: { userId: string, userName: string }) {
  const [loading, setLoading] = useState(false);

  const handleImpersonate = async () => {
    if (!confirm(`Are you sure you want to impersonate ${userName}?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId })
      });
      
      if (res.ok) {
        window.location.href = '/'; // Redirect to the main dashboard
      } else {
        alert('Failed to impersonate user');
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred');
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleImpersonate}
      disabled={loading}
      className="text-blue-500 hover:text-blue-400 font-bold text-xs bg-blue-500/10 px-2 py-1 rounded disabled:opacity-50"
    >
      {loading ? '...' : 'Impersonate'}
    </button>
  );
}
