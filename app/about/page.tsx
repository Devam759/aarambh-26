'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="py-28 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="hero-glow w-96 h-96 bg-brand-pink/15 -top-20 -right-20" />

      <header className="text-center mb-20 relative z-10">
        <span className="page-eyebrow">Our Story</span>
        <h1 className="page-title brand-gradient-text mb-4">About AARAMBH&apos;26</h1>
        <p className="page-subtitle mx-auto">The legacy of innovation, energy, and fearless expression continues.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-brand-pink font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
            The Legacy
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-8 leading-tight text-brand-cloud">
            Beyond Boundaries,
            <br />
            <span className="text-brand-orange">Defying Expectations.</span>
          </h2>
          <p className="text-brand-cloud/60 text-lg leading-relaxed mb-8">
            AARAMBH&apos;26 is not just a festival — it&apos;s a movement. Bringing together 50+ universities,
            20,000+ students, and industry giants, we create an ecosystem where creativity meets technical prowess.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="border-l-4 border-brand-orange pl-4">
              <h4 className="text-4xl font-display font-extrabold text-brand-orange mb-1">50+</h4>
              <p className="text-brand-cloud/50 text-sm">Participating Universities</p>
            </div>
            <div className="border-l-4 border-brand-pink pl-4">
              <h4 className="text-4xl font-display font-extrabold text-brand-pink mb-1">100+</h4>
              <p className="text-brand-cloud/50 text-sm">Tech & Cultural Events</p>
            </div>
          </div>
        </motion.div>

        <div className="glass-card aspect-video relative overflow-hidden group border-brand-blue/20">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/30 via-brand-pink/20 to-brand-blue/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl font-extrabold brand-gradient-text opacity-80">
              &apos;26
            </span>
          </div>
        </div>
      </div>

      <section className="mt-32 relative z-10">
        <div className="text-center mb-14">
          <span className="page-eyebrow">What Drives Us</span>
          <h3 className="section-heading">Our Vision</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <VisionCard
            title="Innovation"
            desc="Pushing the limits of what's possible in tech."
            accent="orange"
          />
          <VisionCard
            title="Culture"
            desc="Celebrating diversity through music, art, and dance."
            accent="pink"
          />
          <VisionCard
            title="Community"
            desc="Building lasting connections across universities."
            accent="blue"
          />
        </div>
      </section>
    </div>
  );
}

function VisionCard({
  title,
  desc,
  accent,
}: {
  title: string;
  desc: string;
  accent: 'orange' | 'pink' | 'blue';
}) {
  const colors = {
    orange: 'text-brand-orange border-brand-orange/30',
    pink: 'text-brand-pink border-brand-pink/30',
    blue: 'text-brand-blue border-brand-blue/30',
  };
  return (
    <Card className={`p-8 border ${colors[accent].split(' ')[1]}`}>
      <h4 className={`text-xl font-display font-bold mb-4 ${colors[accent].split(' ')[0]}`}>{title}</h4>
      <p className="text-brand-cloud/60">{desc}</p>
    </Card>
  );
}
