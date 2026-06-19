'use server';

import { prisma } from '../../lib/prisma';
import { getCurrentUser } from '../actions';
import { revalidatePath } from 'next/cache';
import { testFbrConnection } from '../../lib/fbrService';

async function verifyUltimateAdmin() {
  const user = await getCurrentUser();
  if (user?.role !== 'ULTIMATE_ADMIN') {
    throw new Error('Unauthorized: Only Ultimate Admin can manage FBR integrations.');
  }
}

export async function adminSaveFbrCredentials(formData: FormData) {
  await verifyUltimateAdmin();
  
  const tenantId = formData.get('tenantId') as string;
  const fbrToken = formData.get('fbrToken') as string;
  const posId = formData.get('posId') as string;
  const clientId = formData.get('clientId') as string;
  const clientSecret = formData.get('clientSecret') as string;
  const environment = formData.get('environment') as string;

  if (!tenantId || !posId || !clientId || !clientSecret || !fbrToken) {
    throw new Error('Missing required FBR credentials.');
  }

  // Update FbrIntegration Settings
  await prisma.fbrIntegration.upsert({
    where: { tenantId },
    update: { posId, clientId, clientSecret, environment },
    create: { tenantId, posId, clientId, clientSecret, environment }
  });

  // Update Tenant with 5-year Bearer Token
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { fbrToken }
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
  
  const tenant = await prisma.tenant.findUnique({ 
    where: { id: tenantId },
    include: { fbrIntegration: true }
  });

  const integration = tenant?.fbrIntegration;
  if (!integration || !tenant?.fbrToken) {
    throw new Error('No valid integration or token configured for this tenant.');
  }

  const isConnected = await testFbrConnection({
    posId: integration.posId,
    fbrToken: tenant.fbrToken,
    environment: integration.environment as 'SANDBOX' | 'PRODUCTION'
  });

  if (!isConnected) {
    throw new Error('Failed to connect to FBR API. Please check your token and static IP proxy configuration.');
  }
  
  // Update lastSync timestamp to show connection was successful
  await prisma.fbrIntegration.update({
    where: { tenantId },
    data: { lastSync: new Date() }
  });

  revalidatePath('/admin/fbr-integration');
  return { success: true, message: `Successfully connected to FBR ${integration.environment} Gateway!` };
}
