'use client';

import { useState } from 'react';
import { changeUserPassword } from '../../actions/userActions';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await changeUserPassword(currentPassword, newPassword);
      setStatus({ type: 'success', message: 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mt-8">
      <h2 className="text-xl font-bold mb-6">Change Password</h2>
      {status && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Current Password *</label>
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">New Password *</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Confirm New Password *</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none" />
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button type="submit" disabled={loading} className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </section>
  );
}
