'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { SkeletonTable } from '../../../components/admin/SkeletonLoader';
import { Filter } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterAction, setFilterAction] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    // Fetch last 1000 logs for client side filtering
    const unsub = onSnapshot(query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(1000)), (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const uniqueActions = useMemo(() => Array.from(new Set(logs.map(l => l.action))), [logs]);
  const uniqueUsers = useMemo(() => Array.from(new Set(logs.map(l => l.performedBy))), [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filterAction && log.action !== filterAction) return false;
      if (filterUser && log.performedBy !== filterUser) return false;
      
      const logDateMillis = log.timestamp?.toMillis() || 0;
      if (filterDateFrom) {
        if (logDateMillis < new Date(filterDateFrom).getTime()) return false;
      }
      if (filterDateTo) {
        // End of the day for filterDateTo
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (logDateMillis > toDate.getTime()) return false;
      }
      return true;
    });
  }, [logs, filterAction, filterUser, filterDateFrom, filterDateTo]);

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-adminHeading text-3xl font-bold mb-2">Audit Logs</h1>
        <p className="text-admin-muted">Chronological record of system mutations</p>
      </div>

      <div className="bg-admin-surface border border-admin-border p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex items-center gap-2 text-admin-muted w-full md:w-auto mb-2 md:mb-0">
          <Filter size={18} />
          <span className="font-medium text-sm">Filters</span>
        </div>
        
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs text-admin-muted mb-1">Action Type</label>
          <select 
            value={filterAction} onChange={e => {setFilterAction(e.target.value); setCurrentPage(1);}}
            className="w-full bg-admin-bg border border-admin-border rounded-lg py-1.5 px-3 focus:outline-none focus:border-admin-accent text-sm"
          >
            <option value="">All Actions</option>
            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs text-admin-muted mb-1">Performed By</label>
          <select 
            value={filterUser} onChange={e => {setFilterUser(e.target.value); setCurrentPage(1);}}
            className="w-full bg-admin-bg border border-admin-border rounded-lg py-1.5 px-3 focus:outline-none focus:border-admin-accent text-sm"
          >
            <option value="">All Users</option>
            {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs text-admin-muted mb-1">From Date</label>
          <input 
            type="date" value={filterDateFrom} onChange={e => {setFilterDateFrom(e.target.value); setCurrentPage(1);}}
            className="w-full bg-admin-bg border border-admin-border rounded-lg py-1.5 px-3 focus:outline-none focus:border-admin-accent text-sm [color-scheme:dark]"
          />
        </div>

        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs text-admin-muted mb-1">To Date</label>
          <input 
            type="date" value={filterDateTo} onChange={e => {setFilterDateTo(e.target.value); setCurrentPage(1);}}
            className="w-full bg-admin-bg border border-admin-border rounded-lg py-1.5 px-3 focus:outline-none focus:border-admin-accent text-sm [color-scheme:dark]"
          />
        </div>

        <button 
          onClick={() => { setFilterAction(''); setFilterUser(''); setFilterDateFrom(''); setFilterDateTo(''); setCurrentPage(1); }}
          className="text-admin-accent hover:text-white text-sm px-2 py-1.5 transition-colors"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <SkeletonTable rows={10} />
      ) : (
        <div className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-admin-bg/50 border-b border-admin-border text-admin-muted text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Timestamp</th>
                  <th className="p-4 font-medium">Performed By</th>
                  <th className="p-4 font-medium">Action</th>
                  <th className="p-4 font-medium">Target</th>
                  <th className="p-4 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors text-sm">
                    <td className="p-4 text-admin-muted">
                      {log.timestamp ? log.timestamp.toDate().toLocaleString() : ''}
                    </td>
                    <td className="p-4">{log.performedBy}</td>
                    <td className="p-4 font-medium text-admin-accent">{log.action}</td>
                    <td className="p-4 text-admin-muted">{log.targetEntity}</td>
                    <td className="p-4 whitespace-normal min-w-[200px]">{log.details}</td>
                  </tr>
                ))}
                {paginatedLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-admin-muted">
                      No audit logs found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="p-4 border-t border-admin-border flex justify-between items-center bg-admin-bg/50">
              <span className="text-sm text-admin-muted">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-1 bg-admin-surface border border-admin-border rounded hover:bg-white/5 disabled:opacity-50"
                >Prev</button>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-1 bg-admin-surface border border-admin-border rounded hover:bg-white/5 disabled:opacity-50"
                >Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
