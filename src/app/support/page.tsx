import React from 'react';
import { LifeBuoy, Send, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">PRAL / FBR Support Liaison</h1>
            <p className="text-neutral-400">Create official support tickets matching the dicrm.pral.com.pk guidelines.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Side */}
          <div className="md:col-span-2">
            <form className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <LifeBuoy className="w-5 h-5 text-emerald-500" /> New Case
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">User Type *</label>
                  <select className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                    <option>DI-Support (Taxpayer)</option>
                    <option>IRIS (License Integrator)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Priority *</label>
                  <select className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                    <option>High</option>
                    <option>Normal</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Query Type *</label>
                  <select className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                    <option>Integration</option>
                    <option>Post Integration</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Attachment (Optional)</label>
                  <input type="file" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-4 text-neutral-400 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-emerald-500 hover:file:bg-neutral-700 transition-colors" accept=".pdf" />
                  <p className="text-xs text-neutral-500">Must be PDF &lt; 5MB</p>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-neutral-300">Title *</label>
                  <input type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Brief summary of the issue" />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-neutral-300">Description *</label>
                  <textarea rows={5} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Detailed correspondence..."></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-8 py-3 rounded-xl font-bold transition-all transform active:scale-[0.98]">
                  <Send className="w-5 h-5" />
                  Submit Case
                </button>
              </div>
            </form>
          </div>

          {/* Info Side */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-neutral-200">
                <MessageSquare className="w-5 h-5 text-emerald-500" /> Recent Cases
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/50">
                  <p className="font-semibold text-sm mb-1 text-emerald-500">Case #FBR-1029</p>
                  <p className="text-xs text-neutral-400">Status: In-Progress</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/50">
                  <p className="font-semibold text-sm mb-1 text-emerald-500">Case #FBR-0044</p>
                  <p className="text-xs text-neutral-400">Status: Closed</p>
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center justify-center">
                View All Cases <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
