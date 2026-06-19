'use server';

import { prisma } from '../../lib/prisma';
import { getCurrentTenant, getCurrentUser } from '../actions';
import { revalidatePath } from 'next/cache';
import { createSession } from '../../lib/session';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export async function updateTenantProfile(formData: FormData) {
  const tenant = await getCurrentTenant();
  const user = await getCurrentUser();
  if (!tenant || !user) throw new Error('Unauthorized');

  const businessName = formData.get('businessName') as string;
  const ntnCnic = formData.get('ntnCnic') as string;
  const province = formData.get('province') as string;
  const address = formData.get('address') as string;
  const businessNature = formData.get('businessNature') as string;
  const sector = formData.get('sector') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const website = formData.get('website') as string;

  const logoFile = formData.get('logo') as File | null;
  let logoUrl = tenant.logoUrl;

  if (logoFile && logoFile.size > 0) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    const buffer = Buffer.from(await logoFile.arrayBuffer());
    const fileName = `${tenant.id}-${Date.now()}-${logoFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    
    const { data, error } = await supabase.storage
      .from('tenant-logos')
      .upload(fileName, buffer, {
        contentType: logoFile.type || 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Supabase Upload Error:', error);
      throw new Error('Failed to upload logo to Cloud Storage.');
    }

    const { data: publicUrlData } = supabase.storage
      .from('tenant-logos')
      .getPublicUrl(fileName);
      
    logoUrl = publicUrlData.publicUrl;
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      businessName,
      ntnCnic,
      province,
      address,
      businessNature,
      sector,
      phone,
      email,
      website,
      logoUrl,
      isProfileComplete: true
    }
  });

  // Recreate session with isProfileComplete = true
  await createSession(user.id, tenant.id, user.role, true);

  revalidatePath('/');
  revalidatePath('/settings/profile');
}

export async function adminToggleTenantProfileComplete(tenantId: string, isComplete: boolean) {
  const user = await getCurrentUser();
  if (user?.role !== 'ULTIMATE_ADMIN') throw new Error('Unauthorized');

  await prisma.tenant.update({
    where: { id: tenantId },
    data: { isProfileComplete: isComplete }
  });
  
  revalidatePath('/admin/tenants');
}

export async function tenantCreateUser(formData: FormData) {
  const tenant = await getCurrentTenant();
  const currentUser = await getCurrentUser();
  if (!tenant || currentUser?.role !== 'TENANT_ADMIN') throw new Error('Unauthorized');

  const subscription = await prisma.subscription.findUnique({ where: { tenantId: tenant.id } });
  const maxUsers = subscription?.maxUsers || 5;

  const currentUsersCount = await prisma.user.count({ where: { tenantId: tenant.id } });
  if (currentUsersCount >= maxUsers) {
    throw new Error(`User limit reached. Maximum allowed: ${maxUsers}`);
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  if (!name || !email || !password || !role) throw new Error('Missing fields');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User with this email already exists');

  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      tenantId: tenant.id
    }
  });

  revalidatePath('/settings/users');
}

export async function tenantUpdateUserRole(userId: string, newRole: string) {
  const tenant = await getCurrentTenant();
  const currentUser = await getCurrentUser();
  if (!tenant || currentUser?.role !== 'TENANT_ADMIN') throw new Error('Unauthorized');

  // Verify the target user belongs to this tenant
  const targetUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!targetUser || targetUser.tenantId !== tenant.id) throw new Error('Unauthorized');
  
  // Prevent changing their own role
  if (userId === currentUser.id) throw new Error('Cannot change your own role');

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath('/settings/users');
}

export async function tenantDeleteUser(userId: string) {
  const tenant = await getCurrentTenant();
  const currentUser = await getCurrentUser();
  if (!tenant || currentUser?.role !== 'TENANT_ADMIN') throw new Error('Unauthorized');

  // Verify the target user belongs to this tenant
  const targetUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!targetUser || targetUser.tenantId !== tenant.id) throw new Error('Unauthorized');

  // Prevent deleting themselves
  if (userId === currentUser.id) throw new Error('Cannot delete your own account');

  await prisma.user.delete({ where: { id: userId } });

  revalidatePath('/settings/users');
}
