'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { SkeletonTable } from '../../../components/admin/SkeletonLoader';

// ============================================================================
// BESPOKE CUSTOM GEOMETRIC SVG ICONS (Gradient-free, Sharp, Heavy-mitre)
// ============================================================================

const CustomSearchIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
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
    <circle cx="10" cy="10" r="6" />
    <line x1="14.5" y1="14.5" x2="21" y2="21" />
  </svg>
);

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
// ENTRY LOGS VIEW COMPONENT
// ============================================================================

export default function EntryLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<'all' | 'accepted' | 'declined'>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    // Fetch last 1000 scans for real time client-side query filters
    const unsub = onSnapshot(query(collection(db, 'scanLogs'), orderBy('timestamp', 'desc'), limit(1000)), (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Filter logs dynamically
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Search Query filter (matches name, roll/reg ID, volunteer)
      const matchesSearch = 
        (log.attendeeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.registrationID || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.volunteerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.scannerId || '').toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Result state filter
      const matchesResult = 
        resultFilter === 'all' ||
        (resultFilter === 'accepted' && log.result === 'accepted') ||
        (resultFilter === 'declined' && log.result !== 'accepted');

      // 3. Date bounds filter
      const logDateMillis = log.timestamp?.toMillis() || 0;
      if (filterDateFrom) {
        if (logDateMillis < new Date(filterDateFrom).getTime()) return false;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (logDateMillis > toDate.getTime()) return false;
      }

      return matchesSearch && matchesResult;
    });
  }, [logs, searchQuery, resultFilter, filterDateFrom, filterDateTo]);

  // Reset pagination on filter mutations
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, resultFilter, filterDateFrom, filterDateTo]);

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  return (
    <div className="space-y-8 select-none">
      {/* Title Header */}
      <div>
        <h1 className="font-adminHeading text-3xl font-black uppercase tracking-tight text-brand-ink mb-1.5">Entry Logs</h1>
        <p className="text-admin-muted font-bold text-xs uppercase tracking-wider">Real-time attendance & gate verification logs</p>
      </div>

      {/* Premium Filter Options Bar */}
      <div className="bg-white border-4 border-brand-ink p-6 rounded-md shadow-[4px_4px_0px_0px_#030404] space-y-4">
        
        {/* Row 1: Search attendee */}
        <div className="relative w-full">
          <CustomSearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/40" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-cloud border-2 border-brand-ink rounded-md py-3 pl-11 pr-4 text-sm text-brand-ink font-bold placeholder:text-brand-ink/40 shadow-inner focus:outline-none focus:border-brand-pink focus:bg-white transition-all uppercase tracking-wider"
            placeholder="Search Attendee Name, Registration ID, or Volunteer..."
          />
        </div>

        {/* Row 2: Secondary selectors */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex items-center gap-2 text-brand-ink mb-2 md:mb-0 w-full xl:w-auto">
            <div className="p-2 border-2 border-brand-ink bg-brand-cloud text-brand-ink rounded-md shadow-[1.5px_1.5px_0px_0px_#030404]">
              <CustomFilterIcon size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">Options</span>
          </div>

          {/* Result Filter */}
          <div className="flex-grow min-w-[140px]">
            <label className="block text-[9px] font-black uppercase text-brand-ink/65 tracking-wider mb-1.5">Scan Result</label>
            <select
              value={resultFilter}
              onChange={(e: any) => setResultFilter(e.target.value)}
              className="w-full bg-brand-cloud border-2 border-brand-ink rounded-md py-2.5 px-3 text-xs text-brand-ink font-black uppercase tracking-wider shadow-inner focus:outline-none cursor-pointer focus:bg-white transition-all"
            >
              <option value="all">ALL ENTRIES</option>
              <option value="accepted">APPROVED</option>
              <option value="declined">DECLINED</option>
            </select>
          </div>

          {/* Date from */}
          <div className="flex-grow min-w-[130px]">
            <label className="block text-[9px] font-black uppercase text-brand-ink/65 tracking-wider mb-1.5">From Date</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full bg-brand-cloud border-2 border-brand-ink rounded-md py-2 px-3 text-xs text-brand-ink font-bold focus:outline-none focus:bg-white transition-all shadow-inner uppercase tracking-wider"
            />
          </div>

          {/* Date to */}
          <div className="flex-grow min-w-[130px]">
            <label className="block text-[9px] font-black uppercase text-brand-ink/65 tracking-wider mb-1.5">To Date</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full bg-brand-cloud border-2 border-brand-ink rounded-md py-2 px-3 text-xs text-brand-ink font-bold focus:outline-none focus:bg-white transition-all shadow-inner uppercase tracking-wider"
            />
          </div>

          {/* Clear Actions */}
          <button
            onClick={() => { setSearchQuery(''); setResultFilter('all'); setFilterDateFrom(''); setFilterDateTo(''); }}
            className="px-4 py-2.5 border-2 border-brand-ink bg-white text-xs font-black uppercase text-brand-ink hover:bg-brand-cloud rounded-md transition-colors cursor-pointer focus:outline-none shadow-[2px_2px_0px_0px_#030404]"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      {loading ? (
        <SkeletonTable rows={10} />
      ) : (
        <div className="bg-white border-4 border-brand-ink rounded-md shadow-[6px_6px_0px_0px_#030404] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-brand-cloud border-b-2 border-brand-ink text-brand-ink text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Attendee Name</th>
                  <th className="p-4">Registration ID</th>
                  <th className="p-4">Volunteer / Scanner</th>
                  <th className="p-4">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ink/10">
                {paginatedLogs.map((log) => {
                  const isAccepted = log.result === 'accepted';
                  return (
                    <tr key={log.id} className="hover:bg-brand-cloud/45 transition-colors text-xs font-bold text-brand-ink">
                      <td className="p-4 text-admin-muted font-semibold flex items-center gap-1.5 mt-0.5">
                        <CustomClockIcon size={12} className="text-brand-orange" />
                        {log.timestamp ? log.timestamp.toDate().toLocaleString() : ''}
                      </td>
                      <td className="p-4 font-black">{log.attendeeName}</td>
                      <td className="p-4 font-mono font-semibold text-admin-muted break-all select-all">
                        {log.registrationID}
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{log.volunteerName}</div>
                        <div className="text-[9px] font-black uppercase tracking-wider text-admin-muted mt-0.5">{log.scannerId}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 border-2 border-brand-ink rounded-md text-[9px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#030404] ${
                          isAccepted 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {isAccepted ? 'Approved' : 'Declined'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {paginatedLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-admin-muted font-black text-xs uppercase tracking-wider">
                      No gate check-in logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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
