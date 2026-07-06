import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AuditLogsPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'ULTIMATE_ADMIN' || session.isImpersonated) {
    redirect('/');
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 100, // Show latest 100
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Security Audit Logs</h1>
      <div className="overflow-x-auto rounded border border-neutral-800">
        <table className="w-full text-left border-collapse bg-neutral-900">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Original Admin ID</th>
              <th className="py-3 px-4">Target User/Actor ID</th>
              <th className="py-3 px-4">Tenant ID</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                <td className="py-2 px-4 whitespace-nowrap">{log.timestamp.toLocaleString()}</td>
                <td className="py-2 px-4 font-semibold text-blue-400">{log.action}</td>
                <td className="py-2 px-4 text-neutral-400 font-mono text-sm">{log.originalAdminId || '-'}</td>
                <td className="py-2 px-4 font-mono text-sm">{log.targetUserId || '-'}</td>
                <td className="py-2 px-4 text-neutral-400 font-mono text-sm">{log.tenantId || '-'}</td>
                <td className="py-2 px-4">{log.details || '-'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500">No audit logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
