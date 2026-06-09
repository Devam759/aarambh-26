'use client';
import React, { useEffect } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {

  return (
    <div className="w-full h-full bg-[#040404] flex flex-col items-center justify-center overflow-hidden">
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase bg-brand-ink/40 backdrop-blur-md text-brand-cloud border border-brand-cloud/20 px-4 py-2 rounded hover:border-brand-orange hover:text-brand-orange hover:shadow-[0_0_15px_rgba(255,154,0,0.2)] hover:bg-brand-orange/5 transition-all duration-300 z-[100] flex items-center gap-2"
      >
        <span>SKIP</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <div className="relative w-full h-full flex items-center justify-center">
        <video
          src="/videos/loading%20screen.webm"
          autoPlay
          muted
          playsInline
          onEnded={onComplete}
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload"
          disablePictureInPicture
          className="w-[90%] h-[90%] object-contain md:w-4/5 md:h-4/5 pointer-events-none"
        />
      </div>
    </div>
  );
}
