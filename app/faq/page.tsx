'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQS_DATA, FAQ_CATEGORIES } from '@/constants/faqs';
import PageGlowBackground from '@/components/ui/PageGlowBackground';

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

      <PageGlowBackground />

      {/* Minimal background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-0 left-1/4 w-[1px] h-32 bg-brand-ink/5 hidden lg:block" />
        <div className="absolute bottom-0 right-1/4 w-[1px] h-48 bg-brand-ink/5 hidden lg:block" />
      </div>

      <div className="py-28 px-4 sm:px-6 max-w-5xl mx-auto min-h-screen overflow-hidden relative z-10">
        
        {/* Retro Comic Header */}
        <header className="text-center mb-12 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-brand-orange px-3 py-1.5 rounded-lg text-xs font-bold uppercase mb-4 text-brand-ink">
            <HelpCircle size={16} /> HAVE QUESTIONS?
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase leading-none tracking-tighter text-brand-ink text-center mb-4">
            FREQUENTLY ASKED
          </h1>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase leading-none tracking-tighter text-brand-pink text-center">
            QUESTIONS (FAQ)
          </h1>
          <p className="text-brand-ink/80 text-xs sm:text-sm font-bold uppercase tracking-wide mt-4 max-w-md mx-auto leading-relaxed">
            Find answers to common questions about Aarambh orientation, schedule, rules, and campus life!
          </p>
        </header>

        {/* Horizontal Category Filtering Tabs */}
        <div className="relative z-20 mb-12 w-full">
          <div className="flex flex-wrap gap-3 py-4 px-2 justify-center">
            {FAQ_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setExpandedIdx(null); // Reset accordions
                  }}
                  className={`px-4 py-2 rounded-lg font-display shrink-0 transition-all select-none flex items-center gap-2 border ${
                    isActive
                      ? 'bg-brand-pink text-brand-cloud border-brand-pink font-bold shadow-md scale-102'
                      : 'bg-white text-brand-ink border-brand-ink/10 hover:bg-brand-cloud/30 font-semibold'
                  }`}
                >
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
                      className="border border-brand-ink/10 bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(idx)}
                        className="w-full text-left p-5 sm:p-6 flex gap-4 items-center justify-between font-display font-bold text-brand-ink select-none cursor-pointer transition-colors hover:bg-brand-cloud/40"
                      >
                        <div className="flex flex-col gap-2.5 items-start">
                          <span className="text-base sm:text-lg leading-tight uppercase">
                            {faq.question}
                          </span>
                        </div>
                        <div
                          className={`p-2 rounded-lg shrink-0 transition-all duration-200 ${
                            isOpen ? 'bg-brand-orange text-brand-ink' : 'bg-brand-pink text-white shadow-sm'
                          }`}
                        >
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
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
                            <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-0 border-t border-brand-ink/10">
                              <div className="bg-brand-cloud/30 p-4 border border-brand-ink/5 rounded-lg font-display text-sm sm:text-base font-medium leading-relaxed text-brand-ink/90 mt-4 relative">
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
                className="border border-brand-orange/20 bg-brand-orange/10 text-brand-ink p-10 rounded-xl shadow-md text-center relative overflow-hidden my-8"
              >
                <div className="relative p-5 mb-5 bg-brand-pink rounded-lg text-brand-cloud inline-block">
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
          <div className="border border-brand-ink/10 bg-white text-brand-ink max-w-xl mx-auto p-6 rounded-xl shadow-lg">
            <h3 className="font-display font-bold text-2xl uppercase mb-2 text-brand-pink">STILL IN A CONFUSION?</h3>
            <p className="text-xs uppercase tracking-wide text-brand-ink/80 mb-5 font-bold">
              Our support team and volunteer student council are active 24/7 to resolve your doubts!
            </p>
            <a
              href="https://jklu.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider rounded-md"
            >
              CONTACT ADMISSIONS/STUDENT AFFAIRS OFFICE
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
