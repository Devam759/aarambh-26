"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Ink Black mesh gradient background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #030404 0%, #1a0820 35%, #2a0818 65%, #030404 100%)' }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #ffffff18 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Pink glow top-right */}
      <div className="absolute -top-20 -right-20 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #FF188C55 0%, #FF188C15 40%, transparent 70%)' }} />
      {/* Orange glow bottom-left */}
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #FF9A0035 0%, transparent 65%)' }} />




      {/* AARAMBH watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[22vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap" style={{ color: '#ffffff06' }}>
          AARAMBH
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-24 flex justify-end w-full">
        <div className="space-y-8 max-w-xl">
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-block text-xs font-black uppercase tracking-[0.2em] px-3 py-1.5 mb-6" style={{ background: '#FF188C', color: '#fff' }}>
              JK Lakshmipat University
            </div>
            <h1 className="text-6xl md:text-7xl font-black leading-none tracking-tight text-white mb-4">About</h1>
            <img src="/logo_cloud_white.svg" alt="Aarambh '26 Logo" className="h-20 md:h-28 w-auto object-contain" style={{ filter: 'drop-shadow(0 0 20px #FF188C80)' }} />
          </motion.div>

          <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="text-gray-300 text-lg leading-relaxed">
            The ultimate induction program designed to welcome freshers into a vibrant college community filled with innovation, learning, and endless opportunity.
          </motion.p>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="flex gap-4 flex-wrap">
            <a href="#what-is-aarambh" className="group inline-flex items-center gap-2 px-7 py-3.5 font-black text-white uppercase tracking-wider text-sm transition-all hover:opacity-80 hover:scale-105" style={{ background: '#FF188C', boxShadow: '0 0 30px #FF188C60' }}>
              Discover More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>


      </div>
    </section>
  );
}
