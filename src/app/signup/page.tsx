import React from 'react';
import { signup } from '../actions/auth';
import Link from 'next/link';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 md:p-6 font-sans text-white relative">
      <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-2xl shadow-xl z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-20 w-20 rounded-2xl overflow-hidden relative mb-6 shadow-lg shadow-emerald-500/20 bg-neutral-950">
            <img src="/logo.png" alt="Get Legal Solution Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create an Account</h1>
          <p className="text-neutral-400">Register your company for Get Legal Solution DI</p>
        </div>
        
        <form action={signup} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Footer Links */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-8 text-xs font-bold text-neutral-600 uppercase tracking-widest">
        <a href="https://getlegalsolution.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
        <a href="https://getlegalsolution.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
        <a href="https://getlegalsolution.com/contact-us" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Help Center</a>
      </div>
    </div>
  );
}
