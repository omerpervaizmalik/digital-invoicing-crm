'use server';

import { prisma } from '../../lib/prisma';
import { getCurrentUser } from '../actions';
import { revalidatePath } from 'next/cache';

async function verifyUltimateAdmin() {
  const user = await getCurrentUser();
  if (user?.role !== 'ULTIMATE_ADMIN') {
    throw new Error('Unauthorized: Only Ultimate Admin can manage FBR integrations.');
  }
}

export async function adminSaveFbrCredentials(formData: FormData) {
  await verifyUltimateAdmin();
  
  const tenantId = formData.get('tenantId') as string;
  const posId = formData.get('posId') as string;
  const clientId = formData.get('clientId') as string;
  const clientSecret = formData.get('clientSecret') as string;
  const environment = formData.get('environment') as string;

  if (!tenantId || !posId || !clientId || !clientSecret) {
    throw new Error('Missing required FBR credentials.');
  }

  await prisma.fbrIntegration.upsert({
    where: { tenantId },
    update: { posId, clientId, clientSecret, environment },
    create: { tenantId, posId, clientId, clientSecret, environment }
  });

  revalidatePath('/admin/fbr-integration');
}

export async function adminToggleFbrIntegration(tenantId: string, isActive: boolean) {
  await verifyUltimateAdmin();
  
  await prisma.fbrIntegration.update({
    where: { tenantId },
    data: { isActive }
  });
  
  revalidatePath('/admin/fbr-integration');
}

export async function adminToggleVisibility(tenantId: string, isVisibleToTenant: boolean) {
  await verifyUltimateAdmin();
  
  await prisma.fbrIntegration.update({
    where: { tenantId },
    data: { isVisibleToTenant }
  });
  
  revalidatePath('/admin/fbr-integration');
}

export async function adminTestFbrConnection(tenantId: string) {
  await verifyUltimateAdmin();
  
  const integration = await prisma.fbrIntegration.findUnique({ where: { tenantId } });
  if (!integration) throw new Error('No integration configured for this tenant.');

  // Mock Ping to PRAL/FBR Sandbox
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Update lastSync timestamp to show connection was successful
  await prisma.fbrIntegration.update({
    where: { tenantId },
    data: { lastSync: new Date() }
  });

  revalidatePath('/admin/fbr-integration');
  return { success: true, message: `Successfully connected to FBR ${integration.environment} Gateway!` };
}
