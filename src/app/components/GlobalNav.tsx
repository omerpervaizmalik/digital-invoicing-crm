'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { logout } from '../actions/auth';

export default function GlobalNav({ businessName, role }: { businessName: string, role?: string }) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/' },
    { name: 'Clients', href: '/clients' },
    { name: 'Suppliers', href: '/suppliers' },
    { name: 'Items', href: '/items' },
    { name: 'Vouchers', href: '/vouchers' },
    { name: 'Stock Register', href: '/stock-register' },
  ];

  if (role === 'ULTIMATE_ADMIN') {
    links.push({ name: 'Admin Portal', href: '/admin' });
  } else {
    links.push({ name: 'Settings', href: '/settings/profile' });
  }

  return (
    <nav className="border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-neutral-950" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">{businessName} <span className="text-emerald-500">DI</span></span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          {links.map((link) => {
            // Precise active check: Dashboard is exact '/', others are prefix matches
            const isActive = link.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(link.href);
              
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`transition-colors ${isActive ? 'text-white font-bold' : 'text-neutral-400 hover:text-emerald-400'}`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 ml-4 flex items-center justify-center text-xs font-bold text-neutral-400 uppercase">
            {role?.substring(0, 2) || 'GL'}
          </div>
          <form action={logout}>
            <button type="submit" className="text-xs text-neutral-500 hover:text-red-400 ml-2 transition-colors">
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
