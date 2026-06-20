import React from 'react';
import { getCurrentTenant } from '../../actions';
import { Building2, UploadCloud, AlertCircle } from 'lucide-react';
import { updateTenantProfile } from '../../actions/tenant';
import { redirect } from 'next/navigation';

export default async function SettingsProfilePage() {
  const tenant = await getCurrentTenant();
  
  if (!tenant) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {!tenant.isProfileComplete && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-amber-500 font-bold mb-1">Mandatory Profile Completion Required</h2>
              <p className="text-amber-500/80 text-sm">
                Before you can generate FBR-compliant invoices or access the dashboard, you must provide your complete company profile, including contact details and logo. This ensures your invoices are generated correctly.
              </p>
            </div>
          </div>
        )}

        <header className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-500" />
            Company Profile Settings
          </h1>
          <p className="text-neutral-400">Manage your business identity, contact information, and billing details.</p>
        </header>

        <form action={updateTenantProfile} className="space-y-8">
          {/* Logo Upload Section */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Company Logo</h2>
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-neutral-950 border-2 border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center overflow-hidden shrink-0">
                {tenant.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tenant.logoUrl} alt="Company Logo" className="w-full h-full object-contain" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-neutral-600 mb-2" />
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-neutral-300 mb-2">Upload New Logo</label>
                <input 
                  type="file" 
                  name="logo" 
                  accept="image/*"
                  className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20 transition-colors" 
                />
                <p className="text-xs text-neutral-500 mt-2">Recommended size: 400x150px. Max file size: 2MB.</p>
              </div>
            </div>
          </section>

          {/* Business Details */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Business Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Legal Business Name *</label>
                <input type="text" name="businessName" defaultValue={tenant.businessName} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">NTN / CNIC *</label>
                <input type="text" name="ntnCnic" defaultValue={tenant.ntnCnic} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm font-mono focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Business Nature *</label>
                <input type="text" name="businessNature" defaultValue={tenant.businessNature || ''} placeholder="e.g., Retail, Services" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Sector *</label>
                <input type="text" name="sector" defaultValue={tenant.sector || ''} placeholder="e.g., Technology, Law" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none" />
              </div>
            </div>
          </section>

          {/* Contact & Address */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Contact & Location</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Phone Number *</label>
                <input type="tel" name="phone" defaultValue={tenant.phone || ''} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Support Email *</label>
                <input type="email" name="email" defaultValue={tenant.email || ''} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Website (Optional)</label>
                <input type="url" name="website" defaultValue={tenant.website || ''} placeholder="https://" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Province *</label>
                <select name="province" defaultValue={tenant.province} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none">
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Gilgit">Gilgit-Baltistan</option>
                  <option value="AJK">AJK</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Full Address *</label>
                <textarea name="address" defaultValue={tenant.address} required rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 px-4 text-sm focus:border-emerald-500 outline-none resize-none"></textarea>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-8 py-3 rounded-xl transition-colors">
              Save Profile & Continue
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}
