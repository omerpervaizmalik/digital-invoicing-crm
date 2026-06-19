import React from 'react';
import { PrismaClient } from '@prisma/client';
import EditItemForm from './EditItemForm';

const prisma = new PrismaClient();

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await prisma.item.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!item) {
    return <div className="p-12 text-white">Item not found.</div>;
  }

  // Fetch current stock
  const monthYear = new Date().toISOString().slice(0, 7);
  const stockRecord = await prisma.stockRegister.findUnique({
    where: {
      tenantId_itemCode_monthYear: {
        tenantId: item.tenantId,
        itemCode: item.itemCode,
        monthYear
      }
    }
  });

  const currentStock = stockRecord ? stockRecord.closingQty : 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Edit Item</h1>
        <EditItemForm item={item} currentStock={currentStock} />
      </div>
    </div>
  );
}
