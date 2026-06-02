'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQS_DATA, FAQ_CATEGORIES } from '@/constants/faqs';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return;
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 25;
    const y = (clientY - window.innerHeight / 2) / 25;
    setMousePos({ x, y });
  };

  // Toggle single accordion
  const toggleFAQ = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  // Filter FAQs based on active category
  const filteredFAQs = FAQS_DATA.filter((faq) => {
    return activeCategory === 'all' || faq.category === activeCategory;
  });

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="bg-brand-cloud text-brand-ink min-h-screen relative overflow-hidden transition-colors duration-300"
    >
      {/* Halftone dot pattern background */}
      <div className="absolute inset-0 bg-halftone-black opacity-[0.08] pointer-events-none z-0" />
      
      {/* Retro sketchbook grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(3,4,4,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(3,4,4,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* Dynamic Ambient Gradient Spotlights (Rich Color Depths) */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full bg-brand-pink/15 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[550px] h-[550px] rounded-full bg-brand-orange/15 blur-[145px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[-100px] w-[400px] h-[400px] rounded-full bg-brand-blue/10 blur-[110px] pointer-events-none z-0" />

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
          className="absolute top-[10%] left-[5%] text-brand-pink/25 text-6xl hidden md:block"
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
          className="absolute bottom-[20%] left-[8%] w-12 h-12 rounded-full border-4 border-brand-pink/20 bg-brand-pink/8 flex items-center justify-center font-display font-black text-brand-pink/25 text-lg hidden md:block"
        >
          !
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

      <div className="py-28 px-4 sm:px-6 max-w-5xl mx-auto min-h-screen overflow-hidden relative z-10">
        
        {/* Retro Comic Header */}
        <header className="text-center mb-12 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-brand-orange border-comic-thin px-3 py-1.5 rounded-lg text-xs font-black uppercase shadow-comic-sm rotate-2 mb-4">
            <HelpCircle size={16} /> HAVE QUESTIONS?
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-none tracking-tighter text-brand-ink text-center drop-shadow-[4px_4px_0px_#FF188C] mb-4">
            FREQUENTLY ASKED
          </h1>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-none tracking-tighter text-brand-pink text-center drop-shadow-[4px_4px_0px_#030404]">
            QUESTIONS (FAQ)
          </h1>
          <p className="text-brand-ink/80 text-xs sm:text-sm font-bold uppercase tracking-wide mt-4 max-w-md mx-auto leading-relaxed">
            Find answers to common questions about Aarambh orientation, schedule, rules, and campus life!
          </p>
        </header>

        {/* Horizontal Category Filtering Tabs */}
        <div className="relative z-20 mb-12 w-full">
          <div className="flex flex-wrap gap-3 py-4 px-2 justify-center">
            {FAQ_CATEGORIES.map((cat, idx) => {
              const isActive = activeCategory === cat.id;
              const rotation = idx % 2 === 0 ? 'rotate-1' : '-rotate-1';

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setExpandedIdx(null); // Reset accordions
                  }}
                  className={`comic-interactive border-comic-thin px-4 py-2.5 rounded-lg font-display shrink-0 transition-all select-none flex items-center gap-2 ${
                    isActive
                      ? 'bg-brand-pink text-brand-cloud shadow-solid-ink scale-105 -rotate-2 font-black border-brand-ink'
                      : `bg-white text-brand-ink shadow-comic-sm ${cat.color} font-bold ` + rotation
                  }`}
                >
                  {cat.emoji && <span className="text-base">{cat.emoji}</span>}
                  <span className="text-xs md:text-sm tracking-tighter uppercase">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <AnimatePresence mode="wait">
            {filteredFAQs.length > 0 ? (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {filteredFAQs.map((faq, idx) => {
                  const isOpen = expandedIdx === idx;
                  const categoryMeta = FAQ_CATEGORIES.find((c) => c.id === faq.category);

                  return (
                    <motion.div
                      layout="position"
                      key={faq.question}
                      className="border-comic bg-white rounded-xl shadow-comic overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(idx)}
                        className="w-full text-left p-5 sm:p-6 flex gap-4 items-center justify-between font-display font-black text-brand-ink select-none cursor-pointer transition-colors hover:bg-brand-cloud/40"
                      >
                        <div className="flex flex-col gap-2.5 items-start">
                          <span className="text-base sm:text-lg leading-tight uppercase">
                            {faq.question}
                          </span>
                        </div>
                        <div
                          className={`p-2 border-2 border-brand-ink rounded-lg shadow-comic-sm shrink-0 transition-all duration-200 ${
                            isOpen ? 'bg-brand-orange' : 'bg-brand-pink'
                          }`}
                        >
                          {isOpen ? <Minus size={16} className="text-brand-ink" /> : <Plus size={16} className="text-brand-cloud" />}
                        </div>
                      </button>

                      {/* Expandable Answer */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                          >
                            <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-0 border-t-2 border-dashed border-brand-ink/20">
                              <div className="bg-brand-cloud/30 p-4 border-2 border-brand-ink/15 rounded-lg font-display text-sm sm:text-base font-bold leading-relaxed text-brand-ink/90 mt-4 relative">
                                {faq.answer}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-comic bg-brand-orange text-brand-ink p-10 rounded-xl shadow-comic text-center relative overflow-hidden my-8"
              >
                <div className="relative p-5 mb-5 bg-brand-pink border-comic shadow-comic-sm rounded-lg text-brand-cloud inline-block rotate-[-3deg]">
                  <MessageSquare size={40} className="animate-bounce" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black mb-2 uppercase tracking-tighter">
                  NO QUESTIONS FOUND!
                </h3>
                <p className="text-brand-ink/80 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-bold uppercase">
                  We couldn't find any questions in this category. Try choosing another category above!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Support Section */}
        <section className="mt-20 text-center relative z-10">
          <div className="border-comic bg-white text-brand-ink max-w-xl mx-auto p-6 rounded-xl shadow-comic -rotate-1">
            <h3 className="font-display font-black text-2xl uppercase mb-2 text-brand-pink drop-shadow-[2px_2px_0px_#030404]">STILL IN A CONFUSION?</h3>
            <p className="text-xs uppercase tracking-wide text-brand-ink/80 mb-5 font-bold">
              Our support team and volunteer student council are active 24/7 to resolve your doubts!
            </p>
            <a
              href="https://jklu.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-comic bg-brand-pink text-brand-cloud px-5 py-2.5 font-display text-xs font-black uppercase tracking-wider shadow-comic hover:bg-brand-orange hover:text-brand-ink transition-colors active:scale-[0.98]"
            >
              CONTACT ADMISSIONS/STUDENT AFFAIRS OFFICE
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
