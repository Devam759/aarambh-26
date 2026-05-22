"use client";
import React from 'react';
import Hero from './Hero';
import WhatIsAarambh from './WhatIsAarambh';

export default function AboutSection() {
  return (
    <div id="about" className="w-full flex flex-col bg-dark text-white overflow-hidden">
      <Hero />
      <WhatIsAarambh />
    </div>
  );
}
