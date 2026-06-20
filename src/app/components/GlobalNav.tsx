'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { logout } from '../actions/auth';

export default function GlobalNav({ businessName, role }: { businessName: string, role?: string }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center relative bg-emerald-500/10">
            <img src="/logo.jpeg" alt="Get Legal Solution" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
            {businessName} <span className="text-emerald-500">DI</span>
          </span>
          <span className="font-bold text-lg tracking-tight text-white sm:hidden">
            GLS <span className="text-emerald-500">DI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => {
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

        {/* Mobile Hamburger Icon */}
        <div className="lg:hidden flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-400 uppercase">
            {role?.substring(0, 2) || 'GL'}
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-neutral-950 border-b border-neutral-800 px-4 py-4 flex flex-col gap-4 shadow-xl z-50">
          {links.map((link) => {
            const isActive = link.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(link.href);
              
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-neutral-400 hover:bg-neutral-900'}`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="border-t border-neutral-800 pt-4 mt-2 px-4">
            <form action={logout}>
              <button type="submit" className="w-full text-left text-rose-500 font-medium hover:text-rose-400 transition-colors py-2">
                Log Out
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
