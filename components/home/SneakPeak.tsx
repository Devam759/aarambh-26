'use client';
import React from 'react';
import { motion } from 'framer-motion';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';

export default function SneakPeak() {
  return (
    <section className="w-full relative z-10 bg-[#F7F2E6] border-t-4 border-brand-ink text-brand-ink py-24 px-4 md:px-8 overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]">
      {/* Warm sketchbook dot-grid background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 bg-[#F7F2E6]" />
      
      {/* Dynamic Retro Comic Sunburst Rays */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05] -z-10" 
        style={{
          backgroundImage: `repeating-conic-gradient(from 0deg, #FF9A00 0deg 8deg, transparent 8deg 16deg)`,
          backgroundPosition: 'center 40%'
        }} 
      />

      {/* Halftone Dot Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-multiply -z-10" 
        style={{
          backgroundImage: `radial-gradient(rgba(3, 4, 4, 0.25) 15%, transparent 16%)`,
          backgroundSize: '20px 20px'
        }} 
      />

      {/* Retro Notebook Grid Lines */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(3,4,4,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(3,4,4,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" 
      />

      {/* Soft Vignette Border Shadow */}
      <div 
        className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(3,4,4,0.04)] -z-10" 
      />

      {/* Film strip edge - left */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-brand-ink/[0.12] backdrop-blur-[2px] border-r border-brand-ink/20 hidden lg:block z-10 overflow-hidden shadow-[inset_-10px_0_20px_rgba(0,0,0,0.02)]">
        <div className="w-full flex flex-col items-center gap-8 sm:gap-12 animate-slide-up">
          {Array.from({ length: 40 }).map((_, i) => {
            const hasText = i % 6 === 0;
            return (
            <div key={`spr-l-${i}`} className="relative flex items-center justify-center w-full">
              {hasText && (
                <span className="absolute right-1 sm:right-2 font-mono text-[8px] sm:text-[9px] font-bold text-brand-ink/40 -rotate-90 origin-center tracking-widest">
                  JKLU
                </span>
              )}
              <div className="w-5 h-5 sm:w-8 sm:h-8 shrink-0 rounded-md border-[1.5px] bg-brand-cloud border-brand-ink/20 shadow-[inset_0_3px_6px_rgba(0,0,0,0.08)]" />
            </div>
          )})}
        </div>
      </div>
      
      {/* Film strip edge - right */}
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-brand-ink/[0.12] backdrop-blur-[2px] border-l border-brand-ink/20 hidden lg:block z-10 overflow-hidden shadow-[inset_10px_0_20px_rgba(0,0,0,0.02)]">
        <div className="w-full flex flex-col items-center gap-8 sm:gap-12 animate-slide-down">
          {Array.from({ length: 40 }).map((_, i) => {
            const hasText = i % 5 === 0;
            return (
            <div key={`spr-r-${i}`} className="relative flex items-center justify-center w-full">
              {hasText && (
                <span className="absolute left-1 sm:left-2 font-mono text-[8px] sm:text-[9px] font-bold text-brand-ink/40 rotate-90 origin-center tracking-widest">
                  JKLU
                </span>
              )}
              <div className="w-5 h-5 sm:w-8 sm:h-8 shrink-0 rounded-md border-[1.5px] bg-brand-cloud border-brand-ink/20 shadow-[inset_0_3px_6px_rgba(0,0,0,0.08)]" />
            </div>
          )})}
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-20">
        
        {/* Original Sneak Peak Title */}
        <div className="relative mb-10 flex flex-col items-center w-full z-30">
          
          {/* Adjusted Heading */}
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-display font-black uppercase leading-none tracking-tighter text-center">
              <span className="text-brand-ink">SNEAK</span>
              <span className="text-brand-orange">PEAK</span>
            </h2>
            
            {/* Floating Star */}
            <motion.svg 
              className="absolute -top-3 sm:-top-5 -right-5 sm:-right-8 w-8 h-8 sm:w-14 sm:h-14 drop-shadow-[2px_2px_0_#030404] origin-center" 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <path d="M50 5L61 35L95 35L68 55L79 85L50 65L21 85L32 55L5 35L39 35Z" fill="#FF9A00" />
            </motion.svg>
          </div>
        </div>
        
        {/* Video Description Text Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl mx-auto mt-4 sm:mt-8 mb-12 sm:mb-16 bg-brand-cloud border-comic border-brand-ink p-6 sm:p-10 rounded-xl shadow-[6px_6px_0px_0px_#184176] relative z-20"
        >
          
          <h3 className="font-display font-black text-2xl sm:text-4xl uppercase text-brand-ink mb-4 leading-tight">
            They call it an event. We call it <br className="hidden sm:block" /> <span className="text-brand-orange">The Beginning.</span>
          </h3>
          
          <p className="font-sans font-bold text-base sm:text-lg text-brand-ink/80 leading-relaxed mb-6">
            Watch the Aarambh Aftermovie! From morning treks and pottery sessions to the electrifying DJ night and endless cheering. Witness the efforts, dedication, hard work, and hopes that made the orientation an unforgettable journey for the Batch of 2025 at JKLU.
          </p>
          
          <p className="font-sans font-black text-lg sm:text-xl text-brand-orange uppercase tracking-wide">
            Get ready to experience the madness!
          </p>
        </motion.div>

        {/* Cinema Screen Container */}
        <div className="w-full max-w-5xl relative">
          {/* Animated Glow effects behind the screen */}
          <motion.div 
            className="hidden md:block absolute -inset-4 sm:-inset-6 rounded-3xl blur-xl"
            style={{ background: 'linear-gradient(135deg, #184176, #FFE600, #00D4FF)' }}
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              y: [0, -8, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="hidden md:block absolute -inset-6 sm:-inset-8 rounded-3xl blur-2xl"
            style={{ background: 'linear-gradient(315deg, #00D4FF, #184176, #FFE600)' }}
            animate={{ 
              opacity: [0.1, 0.25, 0.1],
              y: [0, 10, 0],
              x: [-4, 4, -4],
              rotate: [0, 1, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div 
            className="hidden md:block absolute -inset-3 sm:-inset-5 rounded-3xl blur-lg"
            style={{ background: 'linear-gradient(45deg, #00D4FF, #184176)' }}
            animate={{ 
              opacity: [0.08, 0.2, 0.08],
              y: [4, -6, 4],
              scale: [0.98, 1.01, 0.98]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          {/* Main screen frame */}
          <div className="relative bg-white border-[5px] sm:border-[8px] border-white rounded-2xl sm:rounded-3xl p-1.5 sm:p-2.5 shadow-[0_0_40px_rgba(24,65,118,0.15),0_0_80px_rgba(255,154,0,0.08),8px_8px_0px_0px_#030404]">
            {/* Inner screen with video */}
            <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden border-[3px] sm:border-[5px] border-brand-ink bg-brand-ink">
              {/* Scan line overlay */}
              <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
              }} />
              
              <CustomVideoPlayer 
                src="https://storage.googleapis.com/aarambh-26-assets/sneak_peak-hls/master.m3u8" 
                autoPlayOnScroll={true}
              />
            </div>
          </div>
        </div>

        {/* Instagram Follow Sticker/Badge */}
        <div className="mt-12 flex justify-center w-full relative z-20">
          <a
            href="https://www.instagram.com/aarambh_jklu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white border-comic text-brand-ink px-6 py-3.5 shadow-comic hover:bg-brand-blue hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl cursor-pointer group"
          >
            {/* Custom Instagram vector icon */}
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="square" 
              strokeLinejoin="miter" 
              className="group-hover:animate-bounce shrink-0 transition-transform"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span className="font-display font-black text-sm uppercase tracking-wider">
              FOLLOW <span className="text-brand-orange group-hover:text-white">@AARAMBH_JKLU</span> FOR UPDATES
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
