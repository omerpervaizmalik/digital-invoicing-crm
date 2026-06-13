import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/session';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  const session = await getSession();
  if (!session || session.role !== 'ULTIMATE_ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!tenantId) {
    return new NextResponse('Missing tenantId', { status: 400 });
  }

  const tenantData = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      users: true,
      clients: true,
      suppliers: true,
      items: true,
      invoices: {
        include: { items: true, paymentReceipts: true }
      },
      stockRegisters: true,
      fbrIntegration: true,
      subscription: true
    }
  });

  if (!tenantData) {
    return new NextResponse('Tenant not found', { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Disposition', `attachment; filename="${tenantData.businessName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-backup-${new Date().toISOString().split('T')[0]}.json"`);
  headers.set('Content-Type', 'application/json');

  return new NextResponse(JSON.stringify(tenantData, null, 2), {
    status: 200,
    headers
  });
}
