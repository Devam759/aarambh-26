"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WhatIsAarambh() {
  return (
    <section id="what-is-aarambh" className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden bg-brand-cloud">
      {/* Aurora Mesh Fluid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-brand-cloud" />

        {/* Deep sweeping base - Pink */}
        <motion.div
          className="absolute -top-[10%] -right-[10%] w-[70%] h-[80%] rounded-full opacity-[0.2]"
          style={{ background: '#FF188C', filter: 'blur(140px)' }}
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Secondary subtle ribbon - Blue */}
        <motion.div
          className="absolute top-[20%] left-[10%] w-[50%] h-[70%] rounded-full opacity-[0.15]"
          style={{ background: '#0D21DD', filter: 'blur(150px)' }}
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Architectural Grid Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05]" 
          style={{
            backgroundImage: `linear-gradient(to right, #030404 1px, transparent 1px), linear-gradient(to bottom, #030404 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem'
          }}
        />

        {/* Halftone grid overlay */}
        <div className="absolute inset-0 bg-halftone-black opacity-10 mix-blend-overlay" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Narrative Block (Comic Book Text Frame) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-brand-ink uppercase leading-none tracking-tight text-center lg:text-left">
                ABOUT<br />
                <span className="text-brand-pink">AARAMBH</span>
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 border-comic bg-brand-cloud text-brand-ink p-4 sm:p-6 rounded-lg shadow-comic rotate-0 sm:rotate-1 bg-halftone-black">
              <p className="font-bold text-base sm:text-lg leading-relaxed">
                Aarambh is JKLU's orientation program, designed to help new students connect, explore, and confidently begin their university journey.
              </p>
              <p className="font-bold text-base sm:text-lg leading-relaxed text-brand-ink/80">
                More than just an introduction to campus life, it brings together engaging workshops, mentorship sessions, creative activities, and opportunities to build meaningful friendships.
              </p>
              <p className="font-bold text-base sm:text-lg leading-relaxed text-brand-pink">
                From Brush & Bond and vibrant DJ nights to team challenges and cultural experiences, Aarambh encourages you to think boldly, explore beyond the familiar, and make every moment count.
              </p>
            </div>

            {/* Buttons for Rules and FAQ */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/rules"
                className="inline-block border-comic bg-brand-pink text-brand-cloud px-6 py-2.5 font-display text-sm font-black uppercase tracking-wider shadow-comic hover:bg-brand-orange hover:text-brand-ink transition-colors active:scale-[0.98]"
              >
                Rules & Regulations
              </Link>
              <Link
                href="/faq"
                className="inline-block border-comic bg-brand-blue text-brand-cloud px-6 py-2.5 font-display text-sm font-black uppercase tracking-wider shadow-comic hover:bg-brand-orange hover:text-brand-ink transition-colors active:scale-[0.98]"
              >
                FAQ
              </Link>
            </div>
          </motion.div>
 
          {/* Comic Frame Graphic (The Poster Image) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-pink rounded-xl rotate-[3deg] border-comic shadow-comic" />
            <div className="relative border-comic bg-brand-ink p-2 rounded-xl shadow-comic transition-all hover:scale-[1.01] hover:-rotate-1 duration-300">
              {/* Halftone graphic frame border overlay */}
              
              <img 
                src="/aarambh-2025-poster.jpg" 
                alt="Aarambh Poster" 
                className="w-full object-cover rounded-lg border-2 border-brand-ink brightness-[0.9] contrast-[1.1]" 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
