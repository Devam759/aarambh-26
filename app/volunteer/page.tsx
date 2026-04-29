'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock, MapPin, CheckCircle, Users, Settings } from 'lucide-react';

export default function VolunteerPortal() {
  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Volunteer Portal</h1>
          <p className="text-gray-400">Welcome back, Devam. Here is your schedule.</p>
        </div>
        <div className="flex gap-4">
          <button className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/10">
            <CheckCircle size={20} className="text-secondary" /> Mark Attendance
          </button>
          <button className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/10">
            <Settings size={20} /> Settings
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Current Assignment */}
        <div className="xl:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Briefcase size={24} className="text-primary" /> Active Duty
            </h2>
            <div className="glass-card p-8 border-l-4 border-primary">
              <div className="flex flex-wrap gap-8 justify-between items-start">
                <div>
                  <h3 className="text-3xl font-bold mb-4">Registration Desk - Gate 1</h3>
                  <div className="space-y-3 text-gray-400">
                    <p className="flex items-center gap-2"><Clock size={18} /> 09:00 AM - 01:00 PM</p>
                    <p className="flex items-center gap-2"><MapPin size={18} /> Main Entrance Lobby</p>
                    <p className="flex items-center gap-2"><Users size={18} /> Team: Alpha-4 (6 members)</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase">In Progress</span>
                  <button className="btn-primary">View Instructions</button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Upcoming Shifts</h2>
            <div className="space-y-4">
              <ShiftRow title="Crowd Control" date="March 16" time="02:00 PM - 06:00 PM" zone="Stage Area" />
              <ShiftRow title="VIP Hospitality" date="March 17" time="10:00 AM - 02:00 PM" zone="Lounge" />
            </div>
          </section>
        </div>

        {/* Team & Notifications */}
        <div className="space-y-8">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">Your Team</h3>
            <div className="space-y-4">
              <Member name="Rahul Verma" role="Lead" online={true} />
              <Member name="Sneha Kapoor" role="Volunteer" online={true} />
              <Member name="Amit Shah" role="Volunteer" online={false} />
            </div>
          </div>
          
          <div className="glass-card p-6 bg-orange-500/5 border-orange-500/20">
            <h3 className="text-xl font-bold mb-4 text-orange-500">Alerts</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              New briefing for "Tech Expo" volunteers at 08:30 AM tomorrow in Room 402.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShiftRowProps {
  title: string;
  date: string;
  time: string;
  zone: string;
}

function ShiftRow({ title, date, time, zone }: ShiftRowProps) {
  return (
    <div className="glass-card p-5 flex justify-between items-center hover:bg-white/5 transition-colors">
      <div>
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-sm text-gray-500">{date} • {time}</p>
      </div>
      <span className="text-sm text-gray-400 flex items-center gap-1"><MapPin size={14} /> {zone}</span>
    </div>
  );
}

interface MemberProps {
  name: string;
  role: string;
  online: boolean;
}

function Member({ name, role, online }: MemberProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${online ? 'bg-secondary' : 'bg-gray-600'}`} />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <button className="text-xs text-primary hover:underline">Message</button>
    </div>
  );
}
