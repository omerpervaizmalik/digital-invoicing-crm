import React from 'react';
import Link from 'next/link';
import { Users, Building2, CreditCard, Settings, LayoutDashboard, Webhook } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Tenants', href: '/admin/tenants', icon: Building2 },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'FBR Int Center', href: '/admin/fbr-integration', icon: Webhook },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-900 border-b md:border-b-0 md:border-r border-neutral-800 p-4 md:p-6 flex flex-col shrink-0">
        <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 md:mb-6 hidden md:block">Management</h2>
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {adminLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors whitespace-nowrap"
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 shrink-0" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-neutral-950 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
