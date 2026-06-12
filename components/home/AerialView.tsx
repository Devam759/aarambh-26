'use client';
import React from 'react';
import Image from 'next/image';

export default function AerialView() {
  return (
    <section className="w-full relative py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="flex justify-center mb-12 select-none">
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase tracking-wider text-brand-black">
            Aerial View of <span className="text-brand-pink">JKLU</span> Campus
          </h2>
        </div>
        <div className="w-full relative border-2 border-brand-ink/10 rounded-2xl overflow-hidden bg-brand-ink">
          <Image
            src="/images/jklu_map_v3.webp"
            alt="JKLU Campus Aerial View"
            width={1920}
            height={1080}
            unoptimized
            className="w-full h-auto hover:scale-105 transition-transform duration-700"
            style={{ height: 'auto' }}
          />
        </div>
      </div>
    </section>
  );
}
