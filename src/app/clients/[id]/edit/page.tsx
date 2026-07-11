import React from 'react';
import EditClientForm from './EditClientForm';
import { getClient } from '../../../actions';
import { redirect } from 'next/navigation';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const client = await getClient(resolvedParams.id);
  
  if (!client) {
    redirect('/clients');
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Edit Client</h1>
          <p className="text-neutral-400">Update the client's information.</p>
        </header>

        <EditClientForm client={client} />
      </main>
    </div>
  );
}
