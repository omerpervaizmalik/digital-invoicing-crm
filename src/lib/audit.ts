import { prisma } from './prisma';
import { getSession } from './session';

export async function logAction(
  action: string,
  targetUserId?: string | null,
  tenantId?: string | null,
  details?: string | null
) {
  try {
    const session = await getSession();
    
    let originalAdminId: string | null = null;
    let fallbackTenantId: string | null = null;
    let fallbackTargetUserId: string | null = null;

    if (session) {
      originalAdminId = session.isImpersonated ? (session.originalAdminId as string) : null;
      fallbackTenantId = session.tenantId as string | null;
      fallbackTargetUserId = session.userId as string;
    }

    await prisma.auditLog.create({
      data: {
        action,
        targetUserId: targetUserId || fallbackTargetUserId,
        originalAdminId,
        tenantId: tenantId || fallbackTenantId,
        details
      }
    });
  } catch (error) {
    console.error('Error writing audit log:', error);
  }
}
