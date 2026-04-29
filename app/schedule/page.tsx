import React from 'react';
import { motion } from 'framer-motion';
import { SCHEDULE_DATA } from '@/constants/events';
import { Card } from '@/components/ui/Card';

export default function SchedulePage() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
      <header className="text-center mb-20">
        <h1 className="text-6xl font-black mb-4 uppercase tracking-tighter text-white">Event Schedule</h1>
        <p className="text-gray-400 text-xl">Three days of non-stop action across multiple zones.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SCHEDULE_DATA.map((item, idx) => (
          <ScheduleDay key={idx} day={item.day} date={item.date} events={item.events} />
        ))}
      </div>
    </div>
  );
}

function ScheduleDay({ day, date, events }: { day: string; date: string; events: string[] }) {
  return (
    <Card className="p-8 hover:border-primary/30 transition-colors">
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-primary">{day}</h3>
        <p className="text-gray-500 font-medium text-lg">{date}</p>
      </div>
      <ul className="space-y-6">
        {events.map((event) => (
          <li key={event} className="flex items-center gap-4 text-gray-300">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span className="font-medium">{event}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

