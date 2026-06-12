'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Download, Users } from 'lucide-react';
import { SCHEDULE_DATA, DaySchedule, ScheduleItem } from '@/constants/events';
import PageGlowBackground from '@/components/ui/PageGlowBackground';

const dayColors = [
  'border-brand-orange hover:shadow-solid-orange',
  'border-brand-blue hover:shadow-solid-blue',
];

const accentBgs = ['bg-brand-orange', 'bg-[#b4bef4]'];

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

      {/* Floating Dynamic Comic Props */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Floating Star 1 - Top Left */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -5, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          style={{
            x: mousePos.x * -1.2,
            y: mousePos.y * -1.2,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[5%] text-brand-blue/25 text-6xl hidden md:block"
        >
          ★
        </motion.div>

        {/* Floating Star 2 - Bottom Right */}
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -15, 10, 0],
            scale: [1, 0.95, 1.08, 1],
          }}
          style={{
            x: mousePos.x * 1.5,
            y: mousePos.y * 1.5,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[15%] right-[8%] text-brand-orange/25 text-8xl hidden md:block"
        >
          ★
        </motion.div>

        {/* Floating Starburst Shape - Top Right */}
        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [0, 360],
          }}
          style={{
            x: mousePos.x * -0.8,
            y: mousePos.y * -0.8,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[15%] right-[10%] w-16 h-16 border-4 border-brand-blue/20 bg-brand-blue/8 comic-starburst hidden md:block"
        />

        {/* Floating Circle Badge - Bottom Left */}
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            scale: [1, 1.03, 0.97, 1],
          }}
          style={{
            x: mousePos.x * 2.0,
            y: mousePos.y * 2.0,
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-[20%] left-[8%] w-12 h-12 rounded-full border-4 border-brand-blue/20 bg-brand-blue/8 flex items-center justify-center font-display font-black text-brand-blue/25 text-lg hidden md:block"
        >
          !
        </motion.div>

        {/* Floating Lightning Bolt ⚡ - Middle Right */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 8, -8, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          style={{
            x: mousePos.x * -1.5,
            y: mousePos.y * -1.5,
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute top-[45%] right-[6%] text-brand-orange/20 text-7xl font-black hidden md:block"
        >
          ⚡
        </motion.div>

        {/* Floating Cross ✕ - Middle Left */}
        <motion.div
          animate={{
            y: [0, 22, 0],
            rotate: [0, -25, 25, 0],
          }}
          style={{
            x: mousePos.x * 1.8,
            y: mousePos.y * 1.8,
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.2,
          }}
          className="absolute top-[55%] left-[6%] text-brand-blue/20 text-6xl font-black hidden md:block"
        >
          ✕
        </motion.div>

        {/* Dynamic Graphic Lines crossing the edges */}
        <div className="absolute top-0 left-1/4 w-[1px] h-32 bg-brand-ink/5 hidden lg:block" />
        <div className="absolute bottom-0 right-1/4 w-[1px] h-48 bg-brand-ink/5 hidden lg:block" />
      </div>

      <div className="py-28 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen overflow-hidden relative z-10">

        {/* Retro comic header panel */}
        <header className="text-center mb-8 relative z-10 flex flex-col items-center gap-6">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-none tracking-tight text-brand-ink text-center drop-shadow-[2px_2px_0px_rgba(3,4,4,0.1)]">
            SCHEDULE
          </h1>
          <a
            href="/schedule.pdf"
            download
            className="inline-flex items-center gap-2.5 border-comic bg-white text-brand-ink px-8 py-3.5 font-display text-sm font-black uppercase tracking-wider shadow-comic hover:bg-brand-orange hover:text-brand-ink transition-colors active:scale-[0.98]"
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
                  className={`border-comic px-6 py-3 font-display text-lg sm:text-xl font-black uppercase transition-all duration-200 active:scale-95 ${
                    isActive 
                      ? 'bg-brand-blue text-brand-cloud shadow-solid-ink scale-105 rotate-1' 
                      : 'bg-white text-brand-ink shadow-comic hover:bg-brand-orange hover:-translate-y-1'
                  }`}
                >
                  Batch {batchNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Scrollable Neo-Brutalist Tabs */}
        <div className="relative z-20 mb-8 w-full">
          <div className="flex overflow-x-auto gap-3 py-5 px-4 md:justify-center scrollbar-thin scrollbar-thumb-brand-blue scrollbar-track-brand-cloud">
            {SCHEDULE_DATA.map((day, idx) => {
              const isActive = activeDayIdx === idx;
              const rotation = idx % 2 === 0 ? 'rotate-1' : '-rotate-1';
              
              return (
                <button
                  key={day.day}
                  onClick={() => setActiveDayIdx(idx)}
                  className={`comic-interactive border-comic-thin px-4 py-3 rounded-lg font-display shrink-0 transition-all select-none min-w-[120px] ${
                    isActive
                      ? 'bg-[#b4bef4] text-brand-ink shadow-solid-ink scale-105 -rotate-2 font-black'
                      : 'bg-white text-brand-ink shadow-comic-sm hover:bg-brand-orange hover:text-brand-ink font-bold ' + rotation
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
            <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wider text-brand-ink">
              THEME: <span className="text-brand-blue">{activeDay.theme}</span>
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
                      className="border-comic bg-brand-orange text-brand-ink p-8 sm:p-12 rounded-xl shadow-comic text-center relative overflow-hidden my-8"
                    >
                      <div className="absolute top-3 right-3 text-[10px] font-mono font-black text-brand-ink/50 bg-[#b4bef4]/15 px-2 py-0.5 border-comic-thin rounded rotate-3">
                        LEVEL 5 • COHORT EXCURSION
                      </div>
                      
                      <div className="relative p-6 mb-6 bg-[#b4bef4] border-comic shadow-comic-sm rounded-lg text-brand-ink inline-block rotate-[-3deg]">
                        <Compass size={48} className="animate-spin-slow" />
                      </div>

                      <h3 className="font-display text-4xl sm:text-5xl font-black mb-4 uppercase tracking-tighter">
                        {event.title}
                      </h3>
                      <div className="inline-flex items-center gap-1.5 bg-brand-ink text-brand-cloud px-4 py-1.5 rounded-lg border-2 border-brand-cloud font-display text-sm font-black uppercase shadow-comic-sm rotate-1">
                        <MapPin size={16} className="text-brand-orange" /> {event.location}
                      </div>
                      <p className="text-brand-ink/80 text-xs sm:text-sm mt-8 max-w-md mx-auto leading-relaxed font-bold uppercase">
                        WHOOSH! AN ENTIRE DAY DEDICATED TO OUTDOOR ADVENTURES, TEAM BUILDING, AND EXPLORING OFF-CAMPUS WONDERS WITH YOUR CLASSMATES!
                      </p>
                    </motion.div>
                  );
                }

                const badgeTextColor = 'text-brand-ink';

                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                    key={idx}
                    className="border-comic p-5 rounded-xl transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-white text-brand-ink shadow-comic hover:-translate-y-0.5 cursor-pointer"
                  >
                    {/* Time Badge */}
                    <div
                      className={`border-2 border-brand-ink px-4 py-2.5 font-display font-black text-sm shadow-comic-sm shrink-0 w-full sm:w-48 text-center rounded-md whitespace-nowrap ${accentColor} ${badgeTextColor} ${idx % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                    >
                      <div className="flex items-center justify-center whitespace-nowrap">
                        <span className="tracking-wide uppercase font-mono whitespace-nowrap">{event.time}</span>
                      </div>
                    </div>

                    {/* Event details */}
                    <div className="flex gap-4 items-center flex-grow">
                      <div className="space-y-2 w-full">
                        <h3 className="font-display text-lg sm:text-xl font-black uppercase leading-tight tracking-tight text-brand-ink hover:text-brand-pink transition-colors pr-20">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">

                          {event.location && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider border-2 border-brand-ink bg-brand-cloud text-brand-ink shadow-[2px_2px_0px_0px_#030404]">
                              <MapPin size={10} className="text-brand-ink" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {isAllBatches && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider border-2 border-brand-ink bg-brand-blue/10 text-brand-blue shadow-[2px_2px_0px_0px_#030404]">
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
                <div className="text-center py-12 border-comic bg-white rounded-xl">
                  <p className="font-display text-2xl font-black text-brand-ink/50 uppercase">No events scheduled for this batch today.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>


      </div>
    </div>
  );
}
