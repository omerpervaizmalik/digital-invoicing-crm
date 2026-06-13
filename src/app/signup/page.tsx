import React from 'react';
import { signup } from '../actions/auth';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 font-sans text-white">
      <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create an Account</h1>
          <p className="text-neutral-400">Register your company for Get Legal Solution DI</p>
        </div>
        
        <form action={signup} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-emerald-500 border-b border-neutral-800 pb-2">Admin Details</h3>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Full Name</label>
                <input type="text" name="name" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                <input type="email" name="email" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
                <input type="password" name="password" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-emerald-500 border-b border-neutral-800 pb-2">Company Details</h3>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Business Name</label>
                <input type="text" name="businessName" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">NTN / CNIC</label>
                <input type="text" name="ntnCnic" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Province</label>
                  <input type="text" name="province" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Address</label>
                  <input type="text" name="address" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 py-3 rounded-xl font-bold transition-all shadow-lg mt-4">
            Sign Up & Create Workspace
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account? <Link href="/login" className="text-emerald-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
