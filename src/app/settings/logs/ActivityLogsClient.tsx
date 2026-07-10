'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

export default function ActivityLogsClient({ initialLogs }: { initialLogs: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const filteredLogs = useMemo(() => {
    return initialLogs.filter((log) => {
      // Action Filter
      if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
      // Entity Filter
      if (entityFilter !== 'ALL' && log.entity !== entityFilter) return false;
      
      // Search Term (matches user name, email, details)
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const userName = log.user?.name?.toLowerCase() || '';
        const userEmail = log.user?.email?.toLowerCase() || '';
        const details = log.details?.toLowerCase() || '';
        
        if (!userName.includes(lowerSearch) && 
            !userEmail.includes(lowerSearch) && 
            !details.includes(lowerSearch)) {
          return false;
        }
      }
      
      return true;
    });
  }, [initialLogs, searchTerm, actionFilter, entityFilter]);

  const uniqueActions = Array.from(new Set(initialLogs.map(l => l.action)));
  const uniqueEntities = Array.from(new Set(initialLogs.map(l => l.entity)));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search by user, email, or details..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative">
            <select 
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <select 
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Entities</option>
              {uniqueEntities.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/50">
        <table className="w-full text-left text-sm text-neutral-300">
          <thead className="bg-neutral-800 text-neutral-400 font-medium">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Entity</th>
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{log.user?.name || 'Unknown User'}</div>
                    <div className="text-xs text-neutral-500">{log.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {log.entity}
                  </td>
                  <td className="px-6 py-4">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap text-neutral-500 text-xs">
                    <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                    <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  No activity logs found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
