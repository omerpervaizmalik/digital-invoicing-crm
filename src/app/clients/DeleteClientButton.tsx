'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteClient } from '../actions';

export default function DeleteClientButton({ clientId }: { clientId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this client? This cannot be undone.')) {
      try {
        await deleteClient(clientId);
        router.refresh();
      } catch (e: any) {
        alert(e.message || 'Failed to delete client');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-rose-500 font-medium hover:underline p-1 flex items-center justify-center" title="Delete Client">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
