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

        {/* Floating Lightning Bolt ⚡ - Middle Right */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 8, -8, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          style={{
            x: mousePos.x * -1.5,
            y: mousePos.y * -1.5,
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute top-[45%] right-[6%] text-brand-orange/20 text-7xl font-black hidden md:block"
        >
          ⚡
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
        <header className="text-center mb-16 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-brand-pink text-brand-cloud border-comic-thin px-3 py-1.5 rounded-lg text-xs font-black uppercase shadow-comic-sm rotate-[-2deg] mb-4">
            <Shield size={16} /> CODE OF CONDUCT
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-none tracking-tighter text-brand-ink text-center drop-shadow-[4px_4px_0px_#FF9A00] mb-3">
            RULES AND
          </h1>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-none tracking-tighter text-brand-pink text-center drop-shadow-[4px_4px_0px_#030404]">
            REGULATIONS
          </h1>
          <p className="text-brand-ink/80 text-xs sm:text-sm font-bold uppercase tracking-wide mt-5 mb-6 max-w-md mx-auto leading-relaxed">
            All participants must strictly adhere to the following rules and instructions during the orientation event:
          </p>
          <a
            href="https://drive.google.com/file/d/1ZYlhBmtHS6bgUEg6MdhIxg4ipDRmEkpj/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border-comic bg-brand-ink text-brand-cloud px-5 py-2.5 font-display text-sm font-black uppercase tracking-wider shadow-comic hover:bg-brand-orange hover:text-brand-ink transition-colors active:scale-[0.98]"
          >
            <Download size={16} />
            DOWNLOAD RULES BOOK
          </a>
        </header>

        {/* Rules Stack List */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-10 mb-20">
          {RULES_DATA.map((rule, idx) => {
            const isEven = idx % 2 === 0;
            const cardRotation = isEven ? 'rotate-1' : '-rotate-1';
            const badgeRotation = isEven ? '-rotate-6' : 'rotate-6';

            return (
              <motion.div
                initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
                key={rule.id}
                className={`relative border-comic bg-white rounded-2xl shadow-comic p-6 sm:p-8 transition-transform duration-300 hover:scale-[1.01] hover:-translate-y-0.5 ${cardRotation}`}
              >
                {/* Floating Big Comic Number Badge */}
                <div
                  className={`absolute -top-6 -left-4 sm:-left-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full border-comic flex items-center justify-center font-display font-black text-lg sm:text-xl shadow-comic-sm bg-brand-orange text-brand-ink select-none ${badgeRotation}`}
                >
                  {rule.id}
                </div>

                <div className="ml-6 sm:ml-8 space-y-4">
                  {/* Category / Rule Meta Tag */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border-2 border-brand-ink bg-brand-cloud text-brand-ink shadow-[2px_2px_0px_0px_#030404] rotate-[-1deg]">
                      <span className="text-xs">{rule.badge}</span>
                      <span>{rule.tag}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-xl sm:text-2xl font-black uppercase leading-none tracking-tight text-brand-ink">
                    {rule.title}
                  </h3>
                  <p className="font-mono text-xs sm:text-sm font-bold uppercase leading-relaxed text-brand-ink/80 bg-brand-cloud/25 p-4 border-2 border-dashed border-brand-ink/15 rounded-lg">
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
