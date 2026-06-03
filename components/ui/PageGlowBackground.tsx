import React from 'react';

/**
 * Reusable three-blob glow background used on schedule, rules, faq pages.
 * Renders absolutely positioned, so parent must be `relative overflow-hidden`.
 */
export default function PageGlowBackground() {
  return (
    <>
      <div className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full bg-brand-pink/15 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[550px] h-[550px] rounded-full bg-brand-orange/15 blur-[145px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[-100px] w-[400px] h-[400px] rounded-full bg-brand-blue/10 blur-[110px] pointer-events-none z-0" />
    </>
  );
}
