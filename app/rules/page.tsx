'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Download } from 'lucide-react';
import { RULES_DATA } from '@/constants/rules';

export default function RulesPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return;
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 25;
    const y = (clientY - window.innerHeight / 2) / 25;
    setMousePos({ x, y });
  };

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



      <div className="py-28 px-4 sm:px-6 max-w-5xl mx-auto min-h-screen overflow-hidden relative z-10">
        
        {/* Strict Header */}
        <header className="text-center mb-16 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#d32f2f] text-white border-2 border-brand-ink px-4 py-2 rounded-sm text-xs font-black uppercase shadow-[3px_3px_0px_0px_#030404] mb-6">
            <Shield size={16} /> CODE OF CONDUCT
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-none tracking-tighter text-brand-ink text-center mb-2">
            RULES AND
          </h1>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-none tracking-tighter text-[#d32f2f] text-center drop-shadow-[3px_3px_0px_#030404]">
            REGULATIONS
          </h1>
          <p className="text-brand-ink/80 text-xs sm:text-sm font-bold uppercase tracking-wide mt-6 mb-8 max-w-md mx-auto leading-relaxed border-t-2 border-b-2 border-brand-ink/10 py-3">
            All participants must strictly adhere to the following rules and instructions during the orientation event.
          </p>
          <a
            href="https://drive.google.com/file/d/1ZYlhBmtHS6bgUEg6MdhIxg4ipDRmEkpj/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border-comic bg-brand-blue text-brand-cloud px-5 py-2.5 font-display text-sm font-black uppercase tracking-wider shadow-comic hover:bg-brand-orange hover:text-brand-ink transition-colors active:scale-[0.98]"
          >
            <Download size={16} />
            DOWNLOAD RULES BOOK
          </a>
        </header>

        {/* Rules Stack List */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-10 mb-20">
          {RULES_DATA.map((rule, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
                key={rule.id}
                className="relative border-2 border-brand-ink bg-white rounded-sm shadow-[6px_6px_0px_0px_#030404] p-6 sm:p-8 transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Strict Number Badge */}
                <div
                  className="absolute -top-6 -left-4 sm:-left-6 w-12 h-12 sm:w-14 sm:h-14 rounded-sm border-2 border-brand-ink flex items-center justify-center font-display font-black text-lg sm:text-xl shadow-[4px_4px_0px_0px_#030404] bg-[#d32f2f] text-white select-none"
                >
                  {rule.id}
                </div>

                <div className="ml-6 sm:ml-8 space-y-4">


                  {/* Title & Description */}
                  <h3 className="font-display text-xl sm:text-2xl font-black uppercase leading-none tracking-tight text-brand-ink">
                    {rule.title}
                  </h3>
                  <p className="font-display text-sm sm:text-base font-bold leading-relaxed text-brand-ink/90 bg-brand-cloud/30 p-4 border-2 border-dashed border-brand-ink/15 rounded-lg">
                    {rule.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
