import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, createImpersonationSession } from '@/lib/session';
import { logAction } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ULTIMATE_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { targetUserId } = await req.json();
    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await createImpersonationSession(
      targetUser.id,
      targetUser.tenantId,
      targetUser.role,
      session.userId as string
    );

    await logAction('IMPERSONATION_START', targetUser.id, targetUser.tenantId, `Started impersonating ${targetUser.email}`);

    return NextResponse.json({ success: true, message: `Impersonating ${targetUser.name}` });
  } catch (error) {
    console.error('Impersonation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
