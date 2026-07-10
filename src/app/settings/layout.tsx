import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Settings, Users, Activity } from 'lucide-react';
import { getCurrentUser } from '../actions';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const isStandardUser = user?.role === 'STANDARD_USER';

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-sans">
      <header className="mb-8 border-b border-neutral-800 pb-4 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
          <p className="text-neutral-400 mt-1">Manage your account and preferences.</p>
        </div>
      </header>

      <div className="grid grid-cols-[200px_1fr] gap-8">
        <aside>
          <nav className="flex flex-col gap-2">
            {!isStandardUser && (
              <>
                <Link href="/settings/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors">
                  <Settings className="w-5 h-5 text-emerald-500" />
                  Profile
                </Link>
                <Link href="/settings/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors">
                  <Users className="w-5 h-5 text-emerald-500" />
                  Users
                </Link>
                <Link href="/settings/logs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Activity Logs
                </Link>
              </>
            )}
            <Link href="/settings/security" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Security
            </Link>
          </nav>
        </aside>
        
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
