import React from 'react';

export default function ComicBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#F5F1E5] select-none pointer-events-none w-full h-full">
      {/* 1. Subtle, formal background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8f6f0] to-[#F5F1E5] opacity-100" />
      
      {/* 2. Soft, formal radial glows in brand colors */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#215798]/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#184176]/5 blur-[120px]" />
      <div className="absolute top-1/3 right-[10%] w-[40%] h-[40%] rounded-full bg-[#f5821e]/3 blur-[100px]" />
    </div>
  );
}
