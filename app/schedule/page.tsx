import React from 'react';
import { SCHEDULE_DATA } from '@/constants/events';
import { Card } from '@/components/ui/Card';

const dayColors = ['text-brand-orange', 'text-brand-pink', 'text-brand-blue'];
const dotColors = ['bg-brand-orange', 'bg-brand-pink', 'bg-brand-blue'];

export default function SchedulePage() {
  return (
    <div className="py-28 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="hero-glow w-80 h-80 bg-brand-blue/15 top-0 left-0" />

      <header className="text-center mb-20 relative z-10">
        <span className="page-eyebrow">Plan Your Fest</span>
        <h1 className="page-title mb-4">Event Schedule</h1>
        <p className="page-subtitle mx-auto">
          Three days of non-stop action across multiple zones.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {SCHEDULE_DATA.map((item, idx) => (
          <ScheduleDay
            key={idx}
            day={item.day}
            date={item.date}
            events={item.events}
            colorClass={dayColors[idx % 3]}
            dotClass={dotColors[idx % 3]}
          />
        ))}
      </div>
    </div>
  );
}

function ScheduleDay({
  day,
  date,
  events,
  colorClass,
  dotClass,
}: {
  day: string;
  date: string;
  events: string[];
  colorClass: string;
  dotClass: string;
}) {
  return (
    <Card className="p-8 hover:border-brand-pink/40 transition-colors h-full">
      <div className="mb-6 pb-4 border-b border-brand-cloud/10">
        <h3 className={`text-3xl font-display font-extrabold ${colorClass}`}>{day}</h3>
        <p className="text-brand-cloud/50 font-medium text-lg mt-1">{date}</p>
      </div>
      <ul className="space-y-5">
        {events.map((event) => (
          <li key={event} className="flex items-center gap-4 text-brand-cloud/80">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotClass}`} />
            <span className="font-medium">{event}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
