import React from 'react';
import { prisma } from '../../../lib/prisma';
import { getCurrentTenant, getCurrentUser } from '../../actions';
import { redirect } from 'next/navigation';
import ActivityLogsClient from './ActivityLogsClient';

export default async function SettingsLogsPage() {
  const tenant = await getCurrentTenant();
  const user = await getCurrentUser();

  if (!tenant || !user) {
    redirect('/login');
  }

  if (user.role === 'STANDARD_USER') {
    redirect('/settings/security');
  }

  const logs = await prisma.userActivityLog.findMany({
    where: { tenantId: tenant.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        }
      }
    },
    orderBy: {
      timestamp: 'desc'
    },
    take: 1000 // Limit to 1000 most recent for performance
  });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Activity Logs</h2>
        <p className="text-neutral-400">
          Track all user activities, data entries, modifications, and logins across your organization.
        </p>
      </div>

      <ActivityLogsClient initialLogs={logs} />
    </div>
  );
}
