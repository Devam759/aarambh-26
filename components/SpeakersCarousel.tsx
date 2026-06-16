'use client';
import React, { useRef, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';

const speakers = [
  { name: 'Dr. John Doe', role: 'Chief Guest', quote: '"The future belongs to the bold."', color: 'bg-brand-orange', img: '/photo-1.jpg' },
  { name: 'Jane Smith', role: 'Keynote Speaker', quote: '"Innovate, create, inspire."', color: 'bg-brand-blue', img: '/photo-2.jpg' },
  { name: 'DJ Vortex', role: 'Live Artist', quote: '"Let the music take control."', color: 'bg-brand-orange', img: '/photo-3.jpg' },
  { name: 'Alex Wong', role: 'Tech Visionary', quote: '"Code is poetry."', color: 'bg-[#FDE047]', img: '/photo-4.jpg' },
  { name: 'Sarah Lee', role: 'Design Lead', quote: '"Make it pop!"', color: 'bg-[#00E5FF]', img: '/photo-5.jpg' },
];

export default function SpeakersCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <section className="w-full py-24 px-4 bg-brand-ink text-brand-cloud relative overflow-hidden border-t-4 border-brand-cloud">
      <div className="absolute inset-0 bg-halftone-cloud opacity-10 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tight text-brand-orange drop-shadow-[4px_4px_0_#F5F1E5]">
            Meet the Squad
          </h2>
          <p className="mt-4 font-display font-bold text-xl uppercase tracking-widest text-brand-ink border-comic inline-block px-4 py-2 bg-brand-cloud shadow-comic-sm -rotate-2">
            Swipe to view
          </p>
        </div>

        {/* Draggable Carousel */}
        <motion.div 
          ref={carouselRef} 
          className="cursor-grab active:cursor-grabbing overflow-hidden p-8 -mx-8"
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div 
            drag="x"
            dragConstraints={carouselRef}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
            className="flex gap-8 w-max"
          >
            {speakers.map((speaker, idx) => (
              <motion.div 
                key={idx}
                className="w-72 md:w-80 shrink-0 relative group"
                whileHover={!isDragging ? { scale: 1.05, rotate: idx % 2 === 0 ? 2 : -2 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Comic Card Background */}
                <div className={`absolute inset-0 ${speaker.color} border-4 border-brand-cloud rounded-xl translate-x-3 translate-y-3 pointer-events-none`} />
                
                {/* Foreground Card */}
                <div className="relative bg-brand-cloud border-4 border-brand-cloud rounded-xl overflow-hidden shadow-[8px_8px_0px_#F5F1E5]">
                  <div className="aspect-[3/4] bg-zinc-800 relative overflow-hidden">
                    {/* Placeholder for actual image - using halftone gradient for now */}
                    <div className="absolute inset-0 bg-halftone-white opacity-40 mix-blend-overlay" />
                    <div className={`absolute inset-0 bg-gradient-to-t from-brand-ink/80 to-transparent z-10`} />
                    
                    {/* Speaker Info Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-4 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <div className={`inline-block ${speaker.color} text-brand-ink font-black text-xs uppercase px-2 py-1 mb-2 border-2 border-brand-ink`}>
                        {speaker.role}
                      </div>
                      <h3 className="font-display font-black text-3xl uppercase leading-none text-brand-cloud drop-shadow-md">
                        {speaker.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Quote bubble style footer */}
                  <div className="bg-brand-cloud text-brand-ink p-4 border-t-4 border-brand-ink font-bold text-sm italic">
                    {speaker.quote}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
