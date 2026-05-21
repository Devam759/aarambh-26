'use client';
import React from 'react';
import { Briefcase, Clock, MapPin, CheckCircle, Users, Settings } from 'lucide-react';

export default function VolunteerPortal() {
  return (
    <div className="min-h-screen py-28 px-8 max-w-7xl mx-auto relative">
      <div className="hero-glow w-80 h-80 bg-brand-blue/15 top-0 right-0" />

      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
        <div>
          <span className="page-eyebrow">Volunteer Hub</span>
          <h1 className="font-display text-4xl font-extrabold mb-2 text-brand-cloud">Volunteer Portal</h1>
          <p className="text-brand-cloud/60">Welcome back, Devam. Here is your schedule.</p>
        </div>
        <div className="flex gap-4">
          <button className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-brand-cloud/10 rounded-full">
            <CheckCircle size={20} className="text-brand-orange" /> Mark Attendance
          </button>
          <button className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-brand-cloud/10 rounded-full">
            <Settings size={20} className="text-brand-cloud/70" /> Settings
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        <div className="xl:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2 text-brand-cloud">
              <Briefcase size={24} className="text-brand-pink" /> Active Duty
            </h2>
            <div className="glass-card p-8 border-l-4 border-brand-pink">
              <div className="flex flex-wrap gap-8 justify-between items-start">
                <div>
                  <h3 className="text-3xl font-display font-bold mb-4 text-brand-cloud">Registration Desk - Gate 1</h3>
                  <div className="space-y-3 text-brand-cloud/60">
                    <p className="flex items-center gap-2"><Clock size={18} className="text-brand-orange" /> 09:00 AM - 01:00 PM</p>
                    <p className="flex items-center gap-2"><MapPin size={18} className="text-brand-blue" /> Main Entrance Lobby</p>
                    <p className="flex items-center gap-2"><Users size={18} className="text-brand-pink" /> Team: Alpha-4 (6 members)</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <span className="bg-brand-pink/20 text-brand-pink px-4 py-1 rounded-full text-sm font-bold uppercase">In Progress</span>
                  <button className="btn-primary">View Instructions</button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-6 text-brand-cloud">Upcoming Shifts</h2>
            <div className="space-y-4">
              <ShiftRow title="Crowd Control" date="March 16" time="02:00 PM - 06:00 PM" zone="Stage Area" />
              <ShiftRow title="VIP Hospitality" date="March 17" time="10:00 AM - 02:00 PM" zone="Lounge" />
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-6">
            <h3 className="text-xl font-display font-bold mb-6 text-brand-cloud">Your Team</h3>
            <div className="space-y-4">
              <Member name="Rahul Verma" role="Lead" online={true} />
              <Member name="Sneha Kapoor" role="Volunteer" online={true} />
              <Member name="Amit Shah" role="Volunteer" online={false} />
            </div>
          </div>

          <div className="glass-card p-6 bg-brand-orange/10 border-brand-orange/30">
            <h3 className="text-xl font-display font-bold mb-4 text-brand-orange">Alerts</h3>
            <p className="text-sm text-brand-cloud/60 leading-relaxed">
              New briefing for &quot;Tech Expo&quot; volunteers at 08:30 AM tomorrow in Room 402.
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
    <div className="glass-card p-5 flex justify-between items-center hover:bg-brand-cloud/5 transition-colors">
      <div>
        <h4 className="font-bold text-lg text-brand-cloud">{title}</h4>
        <p className="text-sm text-brand-cloud/50">{date} • {time}</p>
      </div>
      <span className="text-sm text-brand-cloud/60 flex items-center gap-1"><MapPin size={14} className="text-brand-blue" /> {zone}</span>
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
        <div className={`w-2 h-2 rounded-full ${online ? 'bg-brand-orange' : 'bg-brand-cloud/30'}`} />
        <div>
          <p className="text-sm font-medium text-brand-cloud">{name}</p>
          <p className="text-xs text-brand-cloud/50">{role}</p>
        </div>
      </div>
      <button className="text-xs text-brand-pink hover:underline font-semibold">Message</button>
    </div>
  );
}
