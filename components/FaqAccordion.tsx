'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { question: "When and where is Aarambh '26 happening?", answer: "The mega welcome fest will take place from July 14-16, 2026, across the entire JKLU campus in Jaipur. Pack your bags for 3 days of absolute madness!" },
  { question: "Who can attend the orientation?", answer: "Aarambh is exclusively for the incoming students (Class of 2029). Seniors and faculty will be there as mentors, organizers, and cheerleaders." },
  { question: "Do I need to register for specific events?", answer: "Your main registration pass covers entry to all major events, DJ nights, and food stalls. Specific workshops or hackathons might require a quick sign-up on the app later." },
  { question: "What should I wear?", answer: "Dress code is smart casual for the day events. For the cultural night, bring out your best party outfits! And don't forget comfortable shoes—you'll be walking and dancing a lot." },
  { question: "Will accommodation be provided?", answer: "Yes, hostel allotments for new students will happen on Day 0 (July 13). You'll be able to move into your rooms before the fest kicks off." },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-24 px-4 bg-brand-orange text-brand-ink relative overflow-hidden border-t-4 border-brand-ink">
      <div className="absolute inset-0 bg-halftone-black opacity-10 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 relative">
          {/* Decorative speech bubble tail */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-cloud border-r-4 border-b-4 border-brand-ink rotate-45 z-0 hidden md:block" />
          
          <div className="bg-brand-cloud border-comic p-8 shadow-comic-lg inline-block relative z-10">
            <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-brand-ink">
              Burning Questions
            </h2>
            <p className="mt-2 font-bold text-brand-ink/70 uppercase tracking-widest text-sm">
              SQUAD REPORT: INTEL SECURED
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <motion.div 
                key={idx}
                className="bg-brand-cloud border-4 border-brand-ink rounded-xl overflow-hidden shadow-comic-sm transition-all hover:shadow-comic"
                initial={false}
                animate={{ backgroundColor: isOpen ? '#F5F1E5' : '#FFFFFF' }}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                >
                  <span className="font-display font-black text-xl md:text-2xl uppercase tracking-tight pr-4">
                    {faq.question}
                  </span>
                  <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.2 : 1 }}
                    className="w-10 h-10 shrink-0 bg-[#FDE047] border-2 border-brand-ink rounded-full flex items-center justify-center font-black text-2xl"
                  >
                    {isOpen ? '−' : '+'}
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="p-6 pt-0 font-bold text-brand-ink/80 leading-relaxed border-t-2 border-brand-ink/10 mx-6">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
