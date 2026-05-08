'use client';

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { SkeletonCard, SkeletonTable, SkeletonRow } from '../../components/admin/SkeletonLoader';
import { Users, CheckCircle, Smartphone, Calendar as CalendarIcon } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalEntriesToday: 0,
    activeScanners: 0,
    loading: true
  });

  const [upcomingEvent, setUpcomingEvent] = useState<any>(null);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

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

    const unsubEvents = onSnapshot(query(collection(db, 'events'), where('date', '>=', new Date()), orderBy('date', 'asc'), limit(1)), (snap) => {
      if (!snap.empty) {
        setUpcomingEvent({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } else {
        setUpcomingEvent(null);
      }
    });

    const unsubAnnouncements = onSnapshot(query(collection(db, 'announcements'), orderBy('postedAt', 'desc'), limit(2)), (snap) => {
      setRecentAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubLogs = onSnapshot(query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(5)), (snap) => {
      setRecentLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubRegs();
      unsubScans();
      unsubScanners();
      unsubEvents();
      unsubAnnouncements();
      unsubLogs();
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-admin-surface border border-admin-border p-6 rounded-xl">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <CalendarIcon size={18} className="text-admin-accent" /> Upcoming Event
            </h2>
            {stats.loading ? <SkeletonRow className="h-16" /> : upcomingEvent ? (
              <div>
                <h3 className="font-adminHeading text-xl">{upcomingEvent.title}</h3>
                <p className="text-sm text-admin-muted mt-1">{upcomingEvent.date?.toDate().toLocaleDateString()} at {upcomingEvent.time}</p>
                <p className="text-sm mt-2">{upcomingEvent.venue}</p>
              </div>
            ) : (
              <p className="text-admin-muted text-sm">No upcoming events.</p>
            )}
          </div>

          <div className="bg-admin-surface border border-admin-border p-6 rounded-xl">
            <h2 className="font-bold mb-4 flex items-center gap-2">Recent Announcements</h2>
            {stats.loading ? <SkeletonTable rows={2} /> : (
              <div className="space-y-4">
                {recentAnnouncements.map(ann => (
                  <div key={ann.id} className="border-b border-admin-border last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium">{ann.title}</h3>
                    <p className="text-xs text-admin-muted mt-1">{ann.postedAt?.toDate().toLocaleString()}</p>
                  </div>
                ))}
                {recentAnnouncements.length === 0 && <p className="text-sm text-admin-muted">No announcements.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-admin-surface border border-admin-border p-6 rounded-xl">
          <h2 className="font-bold mb-4 flex items-center gap-2">Recent Audit Logs</h2>
          {stats.loading ? <SkeletonTable rows={5} /> : (
            <div className="space-y-4">
              {recentLogs.map(log => (
                <div key={log.id} className="text-sm border-b border-admin-border last:border-0 pb-3 last:pb-0">
                  <p className="font-medium text-admin-accent">{log.action}</p>
                  <p className="text-admin-muted text-xs mt-1">
                    {log.performedBy} &middot; {log.targetEntity} &middot; {log.timestamp?.toDate().toLocaleString()}
                  </p>
                </div>
              ))}
              {recentLogs.length === 0 && <p className="text-sm text-admin-muted">No audit logs found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
