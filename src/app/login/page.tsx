import React from 'react';
import { login } from '../actions/auth';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 md:p-6 font-sans text-white relative">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-2xl shadow-xl z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-20 w-20 rounded-2xl overflow-hidden relative mb-6 shadow-lg shadow-emerald-500/20 bg-neutral-950">
            <img src="/logo.png" alt="Get Legal Solution Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-neutral-400">Log in to Get Legal Solution DI</p>
        </div>
        
        <form action={login} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 py-3 rounded-xl font-bold transition-all shadow-lg mt-2">
            Log In
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-neutral-500">
          Don't have an account? <Link href="/signup" className="text-emerald-500 hover:underline">Sign up</Link>
        </p>
      </div>
      
      {/* Footer Links */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-8 text-xs font-bold text-neutral-600 uppercase tracking-widest">
        <a href="https://getlegalsolution.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
        <a href="https://getlegalsolution.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
        <a href="https://getlegalsolution.com/contact-us" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Help Center</a>
      </div>
    </div>
  );
}
