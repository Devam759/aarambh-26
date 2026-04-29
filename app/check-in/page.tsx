'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, ShieldCheck } from 'lucide-react';

export default function CheckIn() {
  const [scanResult, setScanResult] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Digital Check-in</h1>
        <p className="text-gray-400">Scan participant QR codes for rapid entry</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl">
        {/* Scanner Placeholder */}
        <div className="flex flex-col gap-6">
          <div className="glass-card aspect-square flex flex-col items-center justify-center border-dashed border-2 border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            <Scan size={64} className="text-primary mb-4 relative z-10" />
            <p className="text-gray-500 relative z-10">Camera initialization required...</p>
            <button className="btn-primary mt-6 relative z-10">
              Start Scanner
            </button>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-secondary" /> Recent Scans
            </h3>
            <div className="space-y-4">
              <ScanItem name="John Doe" status="Valid" time="2 mins ago" />
              <ScanItem name="Jane Smith" status="Invalid" time="5 mins ago" color="text-red-500" />
            </div>
          </div>
        </div>

        {/* Status Dashboard */}
        <div className="flex flex-col gap-8">
          <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-transparent">
            <h2 className="text-5xl font-black mb-2">1,248</h2>
            <p className="text-gray-400 uppercase tracking-widest text-sm">Total Check-ins</p>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">Live Attendance</h3>
            <div className="space-y-6">
              <StatRow label="Main Auditorium" current={450} total={500} />
              <StatRow label="Workshop Area B" current={120} total={150} />
              <StatRow label="Food Court" current={890} total={1000} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ScanItemProps {
  name: string;
  status: string;
  time: string;
  color?: string;
}

function ScanItem({ name, status, time, color = "text-secondary" }: ScanItemProps) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      <span className={`text-sm font-bold ${color}`}>{status}</span>
    </div>
  );
}

interface StatRowProps {
  label: string;
  current: number;
  total: number;
}

function StatRow({ label, current, total }: StatRowProps) {
  const percent = (current / total) * 100;
  return (
    <div>
      <div className="flex justify-between mb-2 text-sm">
        <span>{label}</span>
        <span className="text-gray-500">{current} / {total}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className="h-full bg-primary"
        />
      </div>
    </div>
  );
}
