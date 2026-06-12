'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const scheduleData = {
  day1: [
    { time: '09:00 AM', title: 'Arrival & Check-in', desc: 'Welcome to JKLU! Collect your welcome kit.', venue: 'Main Gate' },
    { time: '11:00 AM', title: 'The Grand Aarambh', desc: 'Inaugural ceremony and opening performances.', venue: 'Main Auditorium' },
    { time: '02:00 PM', title: 'Ice-Breaker Session', desc: 'Meet your squad and seniors.', venue: 'Student Lounge' },
    { time: '06:00 PM', title: 'DJ Night Kickoff', desc: 'Live music and food stalls.', venue: 'Open Air Theatre' },
  ],
  day2: [
    { time: '10:00 AM', title: 'Tech Showcase', desc: 'Explore the tech clubs and projects.', venue: 'Innovation Lab' },
    { time: '01:00 PM', title: 'Hackathon Ideation', desc: 'Brainstorming session for the upcoming hackathon.', venue: 'Library' },
    { time: '04:00 PM', title: 'Pop-Art Workshop', desc: 'Unleash your creativity.', venue: 'Design Studio' },
    { time: '07:30 PM', title: 'Cultural Night', desc: 'Dance, drama, and pure energy.', venue: 'Main Auditorium' },
  ],
  day3: [
    { time: '09:30 AM', title: 'Alumni Connect', desc: 'Inspiring stories from JKLU alumni.', venue: 'Seminar Hall' },
    { time: '01:00 PM', title: 'Sports Gala', desc: 'Friendly matches across campus.', venue: 'Sports Ground' },
    { time: '05:00 PM', title: 'Award Ceremony', desc: 'Closing notes and prize distribution.', venue: 'Open Air Theatre' },
    { time: '08:00 PM', title: 'The Final Bash', desc: 'Closing party to remember.', venue: 'Student Lounge' },
  ],
};

export default function ScheduleTimeline() {
  const [activeTab, setActiveTab] = useState<'day1' | 'day2' | 'day3'>('day1');

  return (
    <section className="w-full py-24 px-4 bg-brand-cloud text-brand-ink relative overflow-hidden border-t-4 border-brand-ink">
      <div className="absolute inset-0 bg-halftone-black opacity-[0.06] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tight text-brand-ink drop-shadow-[2px_2px_0px_rgba(3,4,4,0.1)]">
            Schedule
          </h2>
          <p className="mt-4 font-display font-bold text-xl uppercase tracking-widest text-brand-blue border-comic inline-block px-4 py-2 bg-brand-cloud shadow-comic-sm rotate-2">
            3 Days of Madness
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(['day1', 'day2', 'day3'] as const).map((day, idx) => (
            <button
              key={day}
              onClick={() => setActiveTab(day)}
              className={`font-display font-black text-xl md:text-3xl uppercase px-8 py-4 border-comic transition-all ${
                activeTab === day 
                  ? 'bg-[#b4bef4] text-brand-ink shadow-comic translate-y-1 translate-x-1' 
                  : 'bg-brand-cloud text-brand-ink shadow-comic-lg hover:-translate-y-1 hover:-translate-x-1 hover:bg-[#FDE047]'
              }`}
              style={{ transform: activeTab !== day ? `rotate(${idx % 2 === 0 ? '-2deg' : '2deg'})` : '' }}
            >
              Day {idx + 1}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative border-l-4 border-brand-ink ml-4 md:ml-12 pl-8 md:pl-16 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, staggerChildren: 0.1 }}
              className="flex flex-col gap-10"
            >
              {scheduleData[activeTab].map((event, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[45px] md:-left-[77px] top-4 w-6 h-6 rounded-full bg-brand-orange border-4 border-brand-ink group-hover:scale-150 transition-transform z-10" />
                  
                  {/* Event Card */}
                  <div className="bg-brand-cloud border-comic p-6 shadow-comic-sm group-hover:shadow-comic-lg group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-brand-blue text-brand-cloud font-black uppercase text-xs px-3 py-1 border-b-4 border-l-4 border-brand-ink">
                      {event.time}
                    </div>
                    <h3 className="font-display font-black text-2xl md:text-3xl text-brand-ink mb-2 pr-20 uppercase tracking-tight">
                      {event.title}
                    </h3>
                    <p className="font-bold text-brand-ink/70 mb-4 max-w-lg">
                      {event.desc}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-[#FDE047] border-2 border-brand-ink px-3 py-1 font-black text-xs uppercase tracking-widest">
                      <span>📍</span> {event.venue}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
