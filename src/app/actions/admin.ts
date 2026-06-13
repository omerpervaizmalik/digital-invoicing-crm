'use server';

import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { getCurrentUser } from '../actions';
import { revalidatePath } from 'next/cache';

async function verifyUltimateAdmin() {
  const user = await getCurrentUser();
  if (user?.role !== 'ULTIMATE_ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function adminCreateUser(formData: FormData) {
  await verifyUltimateAdmin();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const tenantId = formData.get('tenantId') as string;

  if (!email || !password || !name) throw new Error('Missing fields');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User already exists');

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role,
      tenantId: tenantId === 'NONE' ? null : tenantId
    }
  });

  revalidatePath('/admin/users');
}

export async function adminUpdateUserRole(userId: string, newRole: string) {
  await verifyUltimateAdmin();
  
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });
  
  revalidatePath('/admin/users');
}

export async function adminUpdateSubscription(tenantId: string, planTier: string, monthlyQuota: number) {
  await verifyUltimateAdmin();

  await prisma.subscription.upsert({
    where: { tenantId },
    update: { planTier, monthlyQuota },
    create: { tenantId, planTier, monthlyQuota }
  });

  revalidatePath('/admin/subscriptions');
}

export async function adminDeleteUser(userId: string) {
  await verifyUltimateAdmin();
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath('/admin/users');
}

export async function adminDeleteTenant(tenantId: string) {
  await verifyUltimateAdmin();

  await prisma.tenant.delete({
    where: { id: tenantId }
  });

  revalidatePath('/admin/tenants');
}

export async function adminUpdateTenantProfile(tenantId: string, formData: FormData) {
  await verifyUltimateAdmin();

  const businessName = formData.get('businessName') as string;
  const ntnCnic = formData.get('ntnCnic') as string;
  const address = formData.get('address') as string;
  const province = formData.get('province') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const website = formData.get('website') as string;
  const isProfileComplete = formData.get('isProfileComplete') === 'on';
  const maxUsersStr = formData.get('maxUsers') as string;

  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      businessName,
      ntnCnic,
      address,
      province,
      phone,
      email,
      website,
      isProfileComplete
    }
  });

  if (maxUsersStr) {
    const maxUsers = parseInt(maxUsersStr, 10);
    await prisma.subscription.upsert({
      where: { tenantId },
      update: { maxUsers },
      create: {
        tenantId,
        planTier: 'FREE',
        monthlyQuota: 50,
        maxUsers
      }
    });
  }

  revalidatePath('/admin/tenants');
  revalidatePath(`/admin/tenants/${tenantId}/edit`);
}

export async function adminResetUserPassword(userId: string, formData: FormData) {
  await verifyUltimateAdmin();
  
  const newPassword = formData.get('password') as string;
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash }
  });

  revalidatePath('/admin/users');
}
