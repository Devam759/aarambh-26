"use client";
import React from 'react';
import { motion } from 'framer-motion';


export default function WhatIsAarambh() {
  return (
    <section id="what-is-aarambh" className="py-28 px-4 md:px-8 relative overflow-hidden">
      {/* Ink Black gradient */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #030404 0%, #12061a 100%)' }} />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff20 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Pink glow left */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF188C30 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-block text-xs font-black uppercase tracking-[0.2em] px-3 py-1.5 mb-5" style={{ background: '#FF188C', color: '#fff' }}>
                What is Aarambh
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                More than just<br />
                <span style={{ color: '#FF188C' }}>an Orientation</span>
              </h2>
            </div>

            <div className="space-y-4 pl-5" style={{ borderLeft: '3px solid #FF188C' }}>
              <p className="text-gray-300 leading-relaxed">Aarambh is the official gateway into your college journey — a meticulously crafted induction program designed to bridge the gap between school and university life.</p>
              <p className="text-gray-300 leading-relaxed">Far from a traditional orientation, it is a multi-day immersive experience where you discover your true passions, collaborate with brilliant minds, and explore the endless possibilities our campus has to offer.</p>
              <p className="text-gray-300 leading-relaxed">From high-energy cultural nights and hands-on workshops to mentorship sessions — Aarambh sets the foundation for your success. It's where your college legacy begins.</p>
            </div>


          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-5"
          >
            <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid #FF188C50', boxShadow: '0 0 50px #FF188C25' }}>
              <img src="/aarambh-poster.jpg" alt="Aarambh '25 Poster" className="w-full object-cover" />
            </div>


          </motion.div>
        </div>
      </div>
    </section>
  );
}
