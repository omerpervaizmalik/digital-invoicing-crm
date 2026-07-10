import { prisma } from './prisma';

export async function logActivity(
  tenantId: string,
  userId: string,
  action: string,
  entity: string,
  details: string
) {
  try {
    await prisma.userActivityLog.create({
      data: {
        tenantId,
        userId,
        action,
        entity,
        details
      }
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}
