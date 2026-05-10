'use client';

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { SkeletonCard, SkeletonTable, SkeletonRow } from '../../components/admin/SkeletonLoader';
import Link from 'next/link';
import { Users, CheckCircle, Smartphone, ClipboardList, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalEntriesToday: 0,
    activeScanners: 0,
    loading: true
  });

  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);

  useEffect(() => {
    const unsubRegs = onSnapshot(collection(db, 'registrations'), (snap) => {
      setStats(s => ({ ...s, totalRegistrations: snap.size, loading: false }));
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const unsubScans = onSnapshot(query(collection(db, 'scanLogs'), where('timestamp', '>=', today), where('result', '==', 'accepted')), (snap) => {
      setStats(s => ({ ...s, totalEntriesToday: snap.size }));
    });

    const unsubScanners = onSnapshot(query(collection(db, 'scannerAccounts')), (snap) => {
      // active scanners - let's say lastActiveAt within 1 hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      let activeCount = 0;
      snap.forEach(doc => {
        const data = doc.data();
        if (data.lastActiveAt && data.lastActiveAt.toDate() > oneHourAgo) {
          activeCount++;
        }
      });
      setStats(s => ({ ...s, activeScanners: activeCount }));
    });

    const unsubRecentRegs = onSnapshot(query(collection(db, 'registrations'), orderBy('createdAt', 'desc'), limit(5)), (snap) => {
      setRecentRegistrations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubRegs();
      unsubScans();
      unsubScanners();
      unsubRecentRegs();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-adminHeading text-3xl font-bold mb-2">Overview</h1>
        <p className="text-admin-muted">Live snapshot of Aarambh 2026</p>
      </div>

      {stats.loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-admin-surface border border-admin-border p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-admin-muted">Total Registrations</h3>
              <Users className="text-admin-accent" size={20} />
            </div>
            <p className="font-adminHeading text-4xl">{stats.totalRegistrations}</p>
          </div>
          
          <div className="bg-admin-surface border border-admin-border p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-admin-muted">Entries Today</h3>
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <p className="font-adminHeading text-4xl">{stats.totalEntriesToday}</p>
          </div>

          <div className="bg-admin-surface border border-admin-border p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-admin-muted">Active Scanners</h3>
              <Smartphone className="text-blue-500" size={20} />
            </div>
            <p className="font-adminHeading text-4xl">{stats.activeScanners}</p>
          </div>
        </div>
      )}

      <div className="bg-admin-surface border border-admin-border p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold flex items-center gap-2">
            <ClipboardList size={18} className="text-admin-accent" /> Recent Registrations
          </h2>
          <Link href="/admin/registrations" className="text-sm text-admin-accent hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {stats.loading ? <SkeletonTable rows={5} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-admin-muted border-b border-admin-border">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="text-sm">
                    <td className="py-3 font-medium">{reg.name}</td>
                    <td className="py-3">{reg.course}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${reg.hasEntered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {reg.hasEntered ? 'Checked-In' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 text-admin-muted text-xs">
                      {reg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                {recentRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-admin-muted">No recent registrations.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
