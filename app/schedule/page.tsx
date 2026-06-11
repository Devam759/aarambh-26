'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Download, Users } from 'lucide-react';
import { SCHEDULE_DATA, DaySchedule, ScheduleItem } from '@/constants/events';
import PageGlowBackground from '@/components/ui/PageGlowBackground';

const dayColors = [
  'border-brand-orange hover:shadow-solid-orange',
  'border-brand-pink hover:shadow-solid-pink',
];

const accentBgs = ['bg-brand-orange', 'bg-brand-pink'];

export default function SchedulePage() {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [activeBatch, setActiveBatch] = useState<number>(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const activeDay = SCHEDULE_DATA[activeDayIdx];
  const filteredEvents = activeDay.events.filter(e => e.batches.includes(activeBatch));

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return;
    const { clientX, clientY } = e;
    // Calculate distance from center of screen in a normalized range
    const x = (clientX - window.innerWidth / 2) / 25;
    const y = (clientY - window.innerHeight / 2) / 25;
    setMousePos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="bg-brand-cloud text-brand-ink min-h-screen relative overflow-hidden transition-colors duration-300"
    >
      {/* Halftone dot pattern background */}
      <div className="absolute inset-0 bg-halftone-black opacity-[0.08] pointer-events-none z-0" />
      
      {/* Retro sketchbook grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(3,4,4,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(3,4,4,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      <PageGlowBackground />

      {/* Minimal background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-0 left-1/4 w-[1px] h-32 bg-brand-ink/5 hidden lg:block" />
        <div className="absolute bottom-0 right-1/4 w-[1px] h-48 bg-brand-ink/5 hidden lg:block" />
      </div>

      <div className="py-28 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen overflow-hidden relative z-10">

        {/* Retro comic header panel */}
        <header className="text-center mb-8 relative z-10 flex flex-col items-center gap-6">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase leading-none tracking-tighter text-brand-ink text-center">
            AARAMBH SCHEDULE
          </h1>
          <a
            href="/schedule.pdf"
            download
            className="btn-primary inline-flex items-center gap-2.5 px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-brand-cloud rounded-md"
          >
            <Download size={18} />
            DOWNLOAD SCHEDULE
          </a>
        </header>

        {/* Batch Selector */}
        <div className="relative z-20 mb-12 w-full max-w-4xl mx-auto flex flex-col items-center">

          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4].map((batchNum) => {
              const isActive = activeBatch === batchNum;
              return (
                <button
                  key={batchNum}
                  onClick={() => setActiveBatch(batchNum)}
                  className={`px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-all duration-200 rounded-md border ${
                    isActive 
                      ? 'bg-brand-blue text-brand-cloud border-brand-blue shadow-md scale-102' 
                      : 'bg-white text-brand-ink border-brand-ink/10 hover:bg-brand-orange hover:text-brand-ink font-semibold'
                  }`}
                >
                  Batch {batchNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="relative z-20 mb-8 w-full">
          <div className="flex overflow-x-auto gap-3 py-5 px-4 md:justify-center scrollbar-thin scrollbar-thumb-brand-pink scrollbar-track-brand-cloud">
            {SCHEDULE_DATA.map((day, idx) => {
              const isActive = activeDayIdx === idx;
              
              return (
                <button
                  key={day.day}
                  onClick={() => setActiveDayIdx(idx)}
                  className={`px-4 py-2.5 rounded-lg font-display shrink-0 transition-all select-none min-w-[120px] border ${
                    isActive
                      ? 'bg-brand-pink text-brand-cloud border-brand-pink font-bold shadow-md scale-102'
                      : 'bg-white text-brand-ink border-brand-ink/10 hover:bg-brand-cloud/30 font-semibold'
                  }`}
                >
                  <div className="text-sm md:text-base tracking-tighter uppercase">{day.day}</div>
                  <div className="text-[10px] md:text-xs uppercase opacity-85 mt-0.5 tracking-wider font-mono">{day.date}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Theme Banner */}
        {activeDay.theme && (
          <div className="w-full max-w-4xl mx-auto mb-10 text-center relative z-20">
            <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-brand-ink">
              THEME: <span className="text-brand-pink">{activeDay.theme}</span>
            </h2>
          </div>
        )}

        {/* Detailed Itinerary Timeline */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeDayIdx}-${activeBatch}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {filteredEvents.map((event, idx) => {
                const accentColor = accentBgs[idx % accentBgs.length];
                const isAllBatches = event.batches.length === 4;
                
                // Special Layout for All Day Outing (Day 5)
                if (event.time.toLowerCase() === 'all day') {
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      key={idx}
                      className="border border-brand-orange/20 bg-brand-orange/10 text-brand-ink p-8 sm:p-12 rounded-xl shadow-lg text-center relative overflow-hidden my-8"
                    >
                      <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-brand-ink/60 bg-brand-pink/10 px-2 py-0.5 border border-brand-pink/10 rounded">
                        LEVEL 5 • COHORT EXCURSION
                      </div>
                      
                      <div className="relative p-6 mb-6 bg-brand-pink rounded-lg text-brand-cloud inline-block shadow-md">
                        <Compass size={48} className="animate-spin-slow" />
                      </div>

                      <h3 className="font-display text-4xl sm:text-5xl font-bold mb-4 uppercase tracking-tighter">
                        {event.title}
                      </h3>
                      <div className="inline-flex items-center gap-1.5 bg-brand-ink text-brand-cloud px-4 py-1.5 rounded-lg border border-brand-cloud/15 font-display text-sm font-bold uppercase shadow-sm">
                        <MapPin size={16} className="text-brand-orange" /> {event.location}
                      </div>
                      <p className="text-brand-ink/80 text-xs sm:text-sm mt-8 max-w-md mx-auto leading-relaxed font-bold uppercase">
                        WHOOSH! AN ENTIRE DAY DEDICATED TO OUTDOOR ADVENTURES, TEAM BUILDING, AND EXPLORING OFF-CAMPUS WONDERS WITH YOUR CLASSMATES!
                      </p>
                    </motion.div>
                  );
                }

                const badgeTextColor = accentColor === 'bg-brand-pink' ? 'text-brand-cloud' : 'text-brand-ink';

                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                    key={idx}
                    className="border border-brand-ink/10 p-5 rounded-xl transition-all duration-200 flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-white text-brand-ink shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  >
                    {/* Time Badge */}
                    <div
                      className={`px-4 py-2.5 font-display font-bold text-sm shrink-0 w-full sm:w-48 text-center rounded-md whitespace-nowrap ${accentColor} ${badgeTextColor} shadow-sm`}
                    >
                      <div className="flex items-center justify-center whitespace-nowrap">
                        <span className="tracking-wide uppercase font-mono whitespace-nowrap">{event.time}</span>
                      </div>
                    </div>

                    {/* Event details */}
                    <div className="flex gap-4 items-center flex-grow">
                      <div className="space-y-2 w-full">
                        <h3 className="font-display text-lg sm:text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink hover:text-brand-pink transition-colors pr-20">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">

                          {event.location && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-brand-ink/10 bg-brand-cloud text-brand-ink shadow-sm">
                              <MapPin size={10} className="text-brand-ink" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {isAllBatches && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-brand-blue/10 bg-brand-blue/10 text-brand-blue shadow-sm">
                              <Users size={10} className="text-brand-blue" />
                              <span>All Batches</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {filteredEvents.length === 0 && (
                <div className="text-center py-12 border border-brand-ink/10 bg-white rounded-xl shadow-md">
                  <p className="font-display text-2xl font-bold text-brand-ink/50 uppercase">No events scheduled for this batch today.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>


      </div>
    </div>
  );
}
