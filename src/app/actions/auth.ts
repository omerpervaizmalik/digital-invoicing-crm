'use server';

import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '../../lib/session';
import { redirect } from 'next/navigation';
import { logActivity } from '../../lib/activityLogger';

export async function login(prevStateOrFormData: any, maybeFormData?: FormData) {
  const actualFormData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData as FormData;
  const email = actualFormData.get('email') as string;
  const password = actualFormData.get('password') as string;

  if (!email || !password) return { error: 'Please fill all fields' };

  const user = await prisma.user.findFirst({ 
    where: { 
      email: { equals: email.trim(), mode: 'insensitive' } 
    } 
  });
  if (!user) return { error: 'Invalid email or password' };

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return { error: 'Invalid email or password' };

  let isProfileComplete = true;
  if (user.tenantId) {
    const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });
    if (tenant) isProfileComplete = tenant.isProfileComplete;
  }

  await createSession(user.id, user.tenantId, user.role, isProfileComplete);
  
  if (user.tenantId) {
    await logActivity(user.tenantId, user.id, 'LOGIN', 'USER', `User logged in from IP (auth)`);
  }
  
  if (user.role === 'ULTIMATE_ADMIN') {
    redirect('/admin');
  } else {
    redirect('/');
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
