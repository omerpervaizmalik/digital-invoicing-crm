'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteSupplier } from '../actions';

export default function DeleteSupplierButton({ supplierId }: { supplierId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this supplier? This cannot be undone.')) {
      try {
        await deleteSupplier(supplierId);
        router.refresh();
      } catch (e: any) {
        alert(e.message || 'Failed to delete supplier');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-rose-500 font-medium hover:underline p-1 flex items-center justify-center" title="Delete Supplier">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
