'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { SkeletonTable } from '../../../components/admin/SkeletonLoader';

// ============================================================================
// BESPOKE CUSTOM GEOMETRIC SVG ICONS (Gradient-free, Sharp, Heavy-mitre)
// ============================================================================

const CustomFilterIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const CustomClockIcon = ({ className = '', size = 14 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ============================================================================
// AUDIT LOGS VIEW COMPONENT
// ============================================================================

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterAction, setFilterAction] = useState('');
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

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filterAction && log.action !== filterAction) return false;
      
      const logDateMillis = log.timestamp?.toMillis() || 0;
      if (filterDateFrom) {
        if (logDateMillis < new Date(filterDateFrom).getTime()) return false;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (logDateMillis > toDate.getTime()) return false;
      }
      return true;
    });
  }, [logs, filterAction, filterDateFrom, filterDateTo]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterAction, filterDateFrom, filterDateTo]);

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  return (
    <div className="space-y-8 select-none">
      {/* Title Header */}
      <div>
        <h1 className="font-adminHeading text-3xl font-black uppercase tracking-tight text-brand-ink mb-1.5">Audit Logs</h1>
        <p className="text-admin-muted font-bold text-xs uppercase tracking-wider">Chronological record of system mutations</p>
      </div>

      {/* Structured Filter Card */}
      <div className="bg-white border-4 border-brand-ink p-6 rounded-md shadow-[4px_4px_0px_0px_#030404] flex flex-wrap gap-6 items-end">
        <div className="flex items-center gap-2.5 text-brand-ink mb-2 md:mb-0 w-full lg:w-auto">
          <div className="p-2 border-2 border-brand-ink bg-brand-cloud text-brand-ink rounded-md shadow-[2px_2px_0px_0px_#030404]">
            <CustomFilterIcon size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-wider">Filter Registry</span>
        </div>
        
        {/* Action filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-black uppercase text-brand-ink/65 tracking-wider mb-2">Action Type</label>
          <select 
            value={filterAction} 
            onChange={e => setFilterAction(e.target.value)}
            className="w-full bg-brand-cloud border-2 border-brand-ink rounded-md py-2.5 px-3 text-xs text-brand-ink font-bold focus:outline-none focus:bg-white cursor-pointer transition-colors shadow-inner"
          >
            <option value="">ALL MUTATIONS</option>
            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Date From */}
        <div className="flex-grow min-w-[130px]">
          <label className="block text-[10px] font-black uppercase text-brand-ink/65 tracking-wider mb-2">From Date</label>
          <input 
            type="date" 
            value={filterDateFrom} 
            onChange={e => setFilterDateFrom(e.target.value)}
            className="w-full bg-brand-cloud border-2 border-brand-ink rounded-md py-2 px-3 text-xs text-brand-ink font-bold focus:outline-none focus:bg-white transition-colors shadow-inner uppercase tracking-wider"
          />
        </div>

        {/* Date To */}
        <div className="flex-grow min-w-[130px]">
          <label className="block text-[10px] font-black uppercase text-brand-ink/65 tracking-wider mb-2">To Date</label>
          <input 
            type="date" 
            value={filterDateTo} 
            onChange={e => setFilterDateTo(e.target.value)}
            className="w-full bg-brand-cloud border-2 border-brand-ink rounded-md py-2 px-3 text-xs text-brand-ink font-bold focus:outline-none focus:bg-white transition-colors shadow-inner uppercase tracking-wider"
          />
        </div>

        {/* Clear buttons */}
        <button 
          onClick={() => { setFilterAction(''); setFilterDateFrom(''); setFilterDateTo(''); }}
          className="px-4 py-2.5 border-2 border-brand-ink bg-white text-xs font-black uppercase text-brand-ink hover:bg-brand-cloud rounded-md transition-colors cursor-pointer focus:outline-none shadow-[2px_2px_0px_0px_#030404]"
        >
          Clear
        </button>
      </div>

      {/* Main Table logs grid */}
      {loading ? (
        <SkeletonTable rows={10} />
      ) : (
        <div className="bg-white border-4 border-brand-ink rounded-md shadow-[6px_6px_0px_0px_#030404] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-brand-cloud border-b-2 border-brand-ink text-brand-ink text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Performed By</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Target Node</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ink/10">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-cloud/45 transition-colors text-xs font-bold text-brand-ink">
                    <td className="p-4 text-admin-muted font-semibold">
                      {log.timestamp ? log.timestamp.toDate().toLocaleString() : ''}
                    </td>
                    <td className="p-4 font-black">{log.performedBy}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 border-2 border-brand-ink rounded-md text-[9px] font-black uppercase tracking-wider bg-brand-cloud text-brand-ink shadow-[1px_1px_0px_0px_#030404]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-admin-muted font-semibold font-mono">{log.targetEntity}</td>
                    <td className="p-4 whitespace-normal min-w-[240px] max-w-sm text-brand-ink font-semibold leading-relaxed">
                      {log.details}
                    </td>
                  </tr>
                ))}
                {paginatedLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-admin-muted font-black text-xs uppercase tracking-wider">
                      No matching audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t-2 border-brand-ink flex justify-between items-center bg-brand-cloud">
              <span className="text-xs font-black uppercase text-admin-muted">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => {
                    setCurrentPage(p => p - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border-2 border-brand-ink rounded-md bg-white text-xs font-black uppercase text-brand-ink hover:bg-brand-cloud disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Prev
                </button>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => {
                    setCurrentPage(p => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border-2 border-brand-ink rounded-md bg-white text-xs font-black uppercase text-brand-ink hover:bg-brand-cloud disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
