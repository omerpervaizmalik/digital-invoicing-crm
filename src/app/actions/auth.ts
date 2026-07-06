'use server';

import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '../../lib/session';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) throw new Error('Please fill all fields');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error('Invalid credentials');

  let isProfileComplete = true;
  if (user.tenantId) {
    const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });
    if (tenant) isProfileComplete = tenant.isProfileComplete;
  }

  await createSession(user.id, user.tenantId, user.role, isProfileComplete);
  
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
