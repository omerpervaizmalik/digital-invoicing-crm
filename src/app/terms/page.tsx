import React from 'react';
import Link from 'next/link';
import { Scale, CheckCircle2 } from 'lucide-react';

export default function TermsOfServicePage() {
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
            <Scale className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-neutral-500 font-medium">Last Updated: May 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
              <span className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                <Scale className="w-5 h-5" />
              </span>
              Scope of Services
            </h2>
            <p className="text-lg">
              Get Legal Solution (GLS) provides specialized legal consultancy, tax filing assistance, and corporate compliance services. Our Digital Invoicing (DI) platform is a management tool to facilitate these professional services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
              <span className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              Client Obligations
            </h2>
            <p className="text-lg mb-4">To ensure accurate and timely filings, clients must:</p>
            <ul className="list-none space-y-3">
              {[
                "Provide truthful and complete documentation.",
                "Respond to information requests within 48 business hours.",
                "Ensure all submitted credentials (e.g. IRIS passwords) are correct.",
                "Authorize GLS to act as their representative before tax authorities."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2.5 flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
              <span className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                <Scale className="w-5 h-5" />
              </span>
              Platform Usage
            </h2>
            <p className="text-lg">
              Users are granted a limited, non-exclusive, non-transferable license to access and use the DI platform for business purposes. You agree not to misuse the platform, interfere with its operation, or attempt to access it using a method other than the interface and the instructions that we provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
              <span className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              Limitation of Liability
            </h2>
            <p className="text-lg">
              GLS shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
