import React from 'react';
import { login } from '../actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 font-sans text-white">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
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
    </div>
  );
}
