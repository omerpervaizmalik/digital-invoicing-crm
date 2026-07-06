import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center py-12 px-4 font-sans text-white">
      <div className="w-full max-w-4xl flex items-center justify-start mb-8">
        <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
          &larr; Back to Login
        </Link>
      </div>
      
      <div className="max-w-4xl w-full bg-neutral-900 border border-neutral-800 p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="mb-12">
          <div className="h-16 w-16 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-neutral-500 font-medium">Last Updated: May 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
              <span className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                <Eye className="w-5 h-5" />
              </span>
              Information Collection
            </h2>
            <p className="text-lg">
              Get Legal Solution (GLS) collects information necessary to provide our digital invoicing and legal compliance services. This includes business details, tax identification numbers (NTN/CNIC), contact information, and securely stored credentials required for government portal interactions (e.g., FBR IRIS).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
              <span className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                <Lock className="w-5 h-5" />
              </span>
              Data Security
            </h2>
            <p className="text-lg">
              We implement robust, industry-standard security measures to protect your personal and corporate data. All sensitive data is encrypted both in transit and at rest. We restrict access to your information to authorized GLS personnel and integrated services (such as FBR APIs) strictly on a need-to-know basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
              <span className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                <Shield className="w-5 h-5" />
              </span>
              Data Sharing
            </h2>
            <p className="text-lg">
              GLS does not sell, trade, or rent your personal identification information to third parties. We may share necessary information with government tax authorities exclusively for the purpose of fulfilling your authorized compliance obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
              <span className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                <Eye className="w-5 h-5" />
              </span>
              Your Rights
            </h2>
            <p className="text-lg">
              You retain the right to access, update, or request deletion of your personal data from our systems. Should you choose to terminate your relationship with GLS, your data will be securely purged in accordance with our retention policies and applicable legal requirements.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
