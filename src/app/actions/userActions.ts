'use server'

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '../actions';
import { logAction } from '@/lib/audit';

export async function changeUserPassword(currentPassword: string, newPassword: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) throw new Error("Incorrect current password");

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  });

  await logAction('CHANGE_PASSWORD', user.id, user.tenantId, 'User changed their password');
  
  return { success: true };
}
