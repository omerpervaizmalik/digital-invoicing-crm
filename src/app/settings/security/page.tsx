import React from 'react';
import ChangePasswordForm from '../profile/ChangePasswordForm';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Security Settings
          </h1>
          <p className="text-neutral-400">Manage your account security and password.</p>
        </header>

        <ChangePasswordForm />
      </main>
    </div>
  );
}
