'use server';

import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '../../lib/session';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const businessName = formData.get('businessName') as string;
  const ntnCnic = formData.get('ntnCnic') as string;
  const province = formData.get('province') as string;
  const address = formData.get('address') as string;

  if (!email || !password || !name || !businessName || !ntnCnic) {
    throw new Error('Please fill all required fields');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  const passwordHash = await bcrypt.hash(password, 10);

  // Create tenant and user in transaction
  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        businessName,
        ntnCnic,
        province,
        address,
      }
    });

    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'TENANT_ADMIN',
        tenantId: tenant.id
      }
    });

    return { user, tenant };
  });

  await createSession(result.user.id, result.tenant.id, result.user.role, false);
  redirect('/');
}

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
