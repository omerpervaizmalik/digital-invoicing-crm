import { NextResponse } from 'next/server';
import { getSession, restoreAdminSession } from '@/lib/session';
import { logAction } from '@/lib/audit';

export async function POST() {
  try {
    const session = await getSession();
    if (session?.isImpersonated) {
      await logAction('IMPERSONATION_STOP', session.userId as string, session.tenantId as string, 'Stopped impersonating user');
    }

    await restoreAdminSession();

    return NextResponse.json({ success: true, message: 'Impersonation stopped' });
  } catch (error) {
    console.error('Stop impersonation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
