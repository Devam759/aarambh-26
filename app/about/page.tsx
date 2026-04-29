'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
      <header className="text-center mb-20">
        <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-secondary">About Aarambh 2026</h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">The legacy of innovation and excellence continues.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-primary font-bold uppercase tracking-widest mb-4 block">The Legacy</span>
          <h2 className="text-5xl font-black mb-8 leading-tight">Beyond Boundaries, <br/>Defying Expectations.</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Aarambh 2026 is not just a festival; it's a movement. Bringing together 50+ universities, 20,000+ students, and industry giants, we create a ecosystem where creativity meets technical prowess.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-3xl font-bold text-white mb-2">50+</h4>
              <p className="text-gray-500 text-sm">Participating Universities</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white mb-2">100+</h4>
              <p className="text-gray-500 text-sm">Tech & Cultural Events</p>
            </div>
          </div>
        </motion.div>
        <div className="glass-card aspect-video relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
        </div>
      </div>

      <section className="mt-32">
        <h3 className="text-3xl font-bold mb-12 text-center">Our Vision</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <VisionCard title="Innovation" desc="Pushing the limits of what's possible in tech." />
          <VisionCard title="Culture" desc="Celebrating diversity through music, art, and dance." />
          <VisionCard title="Community" desc="Building lasting connections across universities." />
        </div>
      </section>
    </div>
  );
}

function VisionCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="glass-card p-8">
      <h4 className="text-xl font-bold mb-4 text-primary">{title}</h4>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}
