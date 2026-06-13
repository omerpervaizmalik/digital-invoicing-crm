import React from 'react';
import Link from 'next/link';
import { Settings, Users } from 'lucide-react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-sans">
      <header className="mb-8 border-b border-neutral-800 pb-4 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Company Settings</h1>
          <p className="text-neutral-400 mt-1">Manage your business profile and team members.</p>
        </div>
      </header>

      <div className="grid grid-cols-[200px_1fr] gap-8">
        <aside>
          <nav className="flex flex-col gap-2">
            <Link href="/settings/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors">
              <Settings className="w-5 h-5 text-emerald-500" />
              Profile
            </Link>
            <Link href="/settings/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors">
              <Users className="w-5 h-5 text-emerald-500" />
              Users
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
