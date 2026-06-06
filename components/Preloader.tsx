'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const TOTAL_DURATION = 4.0; // 0.8s per slice
  const NUM_SLICES = 5;

  // Generate Mario Animation Arrays for loading screen
  const marioLeft: string[] = ['-10%'];
  const marioLeftTimes: number[] = [0];
  const marioY: number[] = [0];
  const marioYTimes: number[] = [0];
  const marioYEasings: any[] = [];

  for (let i = 0; i < NUM_SLICES; i++) {
    const hitTimeSec = (i + 1) * 0.8;
    const hitNorm = hitTimeSec / TOTAL_DURATION;

    // Exact jump percentages so the final jump perfectly centers on "26"
    const jumpPositions = [12, 30, 48, 66, 83];
    marioLeft.push(`${jumpPositions[i]}%`);
    marioLeftTimes.push(hitNorm);

    const jumpStart = Math.max(0, hitNorm - 0.05);
    const jumpEnd = Math.min(1, hitNorm + 0.05);
    marioY.push(0, -80, 0);
    marioYTimes.push(jumpStart, hitNorm, jumpEnd);
    marioYEasings.push("linear", "easeOut", "easeIn");
  }

  useEffect(() => {
    // Automatically trigger completion after animation sequence
    document.documentElement.classList.remove('preloader-active');
    
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, TOTAL_DURATION * 1000 + 500);

    return () => {
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      data-preloader
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[90] bg-brand-ink flex flex-col items-center justify-center overflow-hidden"
    >
      <button
        onClick={() => {
          document.documentElement.classList.remove('preloader-active');
          onComplete();
        }}
        className="absolute top-6 right-6 text-xs font-mono font-bold tracking-widest uppercase bg-brand-ink text-brand-cloud/60 border border-brand-cloud/20 px-4 py-2 rounded hover:text-brand-cloud hover:border-brand-cloud/50 transition-colors z-[100]"
      >
        SKIP
      </button>

      <div className="relative w-full max-w-xl h-56 mt-20 border-b-4 border-brand-orange">
        {/* The Logo SVG Slices (Invisible to Color) */}
        <div className="absolute top-0 w-full flex items-center justify-center pointer-events-none mt-2">
          <div className="relative w-full aspect-[550/120] z-20">
            {Array.from({ length: 5 }).map((_, sliceIndex) => {
              const boundaries = [0, 18, 36, 55, 75, 100];
              const leftPercent = boundaries[sliceIndex];
              const rightPercent = 100 - boundaries[sliceIndex + 1];
              const hitTime = (sliceIndex + 1) * 0.8;

              return (
                <motion.div
                  key={`mario-slice-${sliceIndex}`}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 1], // Appear on hit
                    filter: [
                      "brightness(1.5) contrast(1.2)", // Flash bright color on impact
                      "brightness(1) contrast(1)", // Settle to original colors
                      "brightness(1) contrast(1)"
                    ],
                    y: [0, -15, 0] // Bump up slightly when hit
                  }}
                  transition={{
                    delay: hitTime,
                    duration: 0.3,
                    times: [0, 0.3, 1]
                  }}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    clipPath: `inset(0% ${rightPercent}% 0% ${leftPercent}%)`,
                    WebkitClipPath: `inset(0% ${rightPercent}% 0% ${leftPercent}%)`
                  }}
                >
                  <Image
                    src="/aarambh_logo_extruded.png"
                    alt="AARAMBH"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mario Sprite Track (GPU Accelerated) */}
        <div className="absolute bottom-[-8px] md:bottom-[-16px] w-full h-12 md:h-16 pointer-events-none">
          <motion.div
            animate={{ x: marioLeft }}
            transition={{ x: { duration: TOTAL_DURATION, times: marioLeftTimes, ease: "linear" } }}
            className="absolute w-full h-full"
          >
            <motion.div
              animate={{ y: marioY }}
              transition={{ y: { duration: TOTAL_DURATION, times: marioYTimes, ease: marioYEasings } }}
              className="absolute left-0 w-12 h-12 md:w-16 md:h-16"
            >
              <div className="w-full h-full relative flex items-center justify-center">
                <img
                  src="/mario-transparent.gif"
                  alt="Mario Running"
                  className="w-full h-full object-contain -scale-x-100"
                  style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.5))" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <h3 className="font-display font-black text-brand-pink text-xl mt-12 animate-pulse uppercase">LOADING...</h3>
    </motion.div>
  );
}
