'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';

export default function SneakPeak() {
  return (
    <section className="w-full relative z-10 bg-[#F7F2E6] border-t border-brand-ink/10 text-brand-ink py-20 px-4 md:px-8 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-20">
        
        {/* Title */}
        <div className="relative mb-8 flex flex-col items-center w-full z-30">
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase leading-none tracking-tight text-center">
              <span className="text-brand-ink">SNEAK </span>
              <span className="text-brand-blue">PEEK</span>
            </h2>
          </div>
        </div>
        
        {/* Description Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl mx-auto mt-2 sm:mt-6 mb-12 sm:mb-16 bg-white border border-brand-ink/10 p-6 sm:p-10 rounded-xl shadow-md relative z-20"
        >
          <h3 className="font-display font-black text-xl sm:text-3xl uppercase text-brand-ink mb-4 leading-tight">
            They call it an event. We call it <br className="hidden sm:block" /> <span className="text-brand-orange font-black">The Beginning.</span>
          </h3>
          
          <p className="text-sm sm:text-base text-brand-ink/80 leading-relaxed mb-6 font-medium">
            Watch the Aarambh Aftermovie! From morning treks and pottery sessions to the electrifying DJ night and endless cheering. Witness the efforts, dedication, hard work, and hopes that made the orientation an unforgettable journey for the Batch of 2025 at JKLU.
          </p>
          
          <p className="font-bold text-base sm:text-lg text-brand-blue uppercase tracking-wide">
            Get ready to experience the journey!
          </p>
        </motion.div>

        {/* Video Player Container */}
        <div className="w-full max-w-5xl relative px-2 sm:px-0">
          {/* Main screen frame */}
          <div className="relative bg-white border border-brand-ink/10 rounded-2xl p-1.5 sm:p-2.5 shadow-xl">
            {/* Inner screen with video */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-brand-ink/10 bg-brand-ink">
              <CustomVideoPlayer 
                src="https://storage.googleapis.com/aarambh-26-assets/sneak_peak-hls/master.m3u8" 
                autoPlayOnScroll={true}
              />
            </div>
          </div>
        </div>

        {/* Instagram Follow Button */}
        <div className="mt-12 flex justify-center w-full relative z-20">
          <a
            href="https://www.instagram.com/aarambh_jklu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white border border-brand-ink/20 text-brand-ink px-6 py-3.5 shadow-sm hover:bg-brand-blue hover:text-white hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl cursor-pointer group"
          >
            {/* Custom Instagram vector icon */}
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="square" 
              strokeLinejoin="miter" 
              className="shrink-0 transition-transform"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider">
              FOLLOW <span className="text-brand-orange group-hover:text-white transition-colors">@AARAMBH_JKLU</span> FOR UPDATES
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
