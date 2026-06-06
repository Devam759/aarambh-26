'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  // Automatically trigger completion after animation sequence
  useEffect(() => {
    // Make the page body visible as soon as the preloader mounts and is painting
    document.documentElement.classList.remove('preloader-active');
    document.body.style.visibility = 'visible';

    const timer = setTimeout(() => {
      sessionStorage.setItem('hasPlayedIntro', '1');
      onComplete();
    }, 1500); // 1.5 seconds total preloader duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] bg-brand-ink flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Abstract Background Elements inside Preloader */}
      <div className="absolute inset-0 bg-halftone-cloud opacity-10" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[800px] h-[800px] border-[20px] border-brand-pink/20 rounded-full border-dashed"
      />

      {/* 3D Animated Logo Container */}
      <motion.div
        initial={{ scale: 0.5, rotateY: 90, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        transition={{ duration: 1.2, type: 'spring', bounce: 0.5 }}
        className="relative z-10"
        style={{ perspective: 1000 }}
      >
        <div className="relative flex justify-center items-center">
          <Image 
            src="/aarambh_logo_removebg.png" 
            alt="AARAMBH 26" 
            width={600} 
            height={300} 
            className="w-[80vw] max-w-[600px] object-contain drop-shadow-[8px_8px_0px_#030404]"
            priority
          />
        </div>
      </motion.div>

      {/* Loading Bar */}
      <div className="absolute bottom-20 w-64 h-3 bg-brand-cloud/20 border-2 border-brand-cloud rounded-full overflow-hidden p-0.5">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
          className="h-full bg-brand-pink rounded-full"
        />
      </div>
      <div className="absolute bottom-12 font-display font-black text-brand-cloud uppercase tracking-widest text-lg">
        आरंभ हो रहा है...
      </div>
    </motion.div>
  );
}
