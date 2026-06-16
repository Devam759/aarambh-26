'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegistrationSection() {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 w-full max-w-5xl relative z-10 mx-auto">
      <div className="relative border-comic bg-brand-cloud text-brand-ink p-8 sm:p-16 lg:p-20 rounded-xl overflow-hidden flex flex-col items-center text-center gap-12">

        {/* Upper Section: Clean Typography & Messaging (Centered) */}
        <div className="flex flex-col items-center text-center relative z-10 w-full max-w-3xl">
      
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase leading-[0.9] mb-6 text-center">
            AARAMBH 2026 <br />
            <span className="bg-brand-ink text-brand-cloud px-4 py-1.5 inline-block my-2 transform -rotate-1 shadow-[4px_4px_0px_0px_#0D21DD] border-comic rounded-lg">
              REGISTRATION
            </span>
          </h2>

          <p className="text-brand-ink text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans font-medium opacity-90 text-center">
            Kickstart your JKLU journey with a registration fee of ₹2500 (Non-refundable) covering all essentials for a vibrant and welcoming orientation experience.
          </p>
        </div>

        {/* Skeuomorphic Spiral Diary/Notebook Details Menu */}
        <div className="w-full max-w-4xl relative z-10 my-4 select-none">
          {/* Diary Outer Cover */}
          <div className="bg-[#5c2d25] border-comic rounded-2xl p-3 sm:p-5 relative md:rotate-[0.5deg]">
            {/* Spine edge details (skeuomorphic book spine on left edge) */}
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#4a231d] rounded-l-xl z-20" />
            
            {/* Diary Inner Body - 2 Columns (Open pages) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-comic border-brand-ink bg-[#fbf9f3] rounded-lg overflow-hidden relative min-h-[520px]">
              
              {/* Ruled Paper Gradients applied as background to both pages */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.8] z-0 bg-[#fbf9f3]" 
                style={{
                  backgroundImage: `
                    linear-gradient(to right, transparent 38px, #ff8da1 38px, #ff8da1 39px, transparent 39px),
                    repeating-linear-gradient(transparent, transparent 31px, rgba(3, 4, 4, 0.08) 31px, rgba(3, 4, 4, 0.08) 32px)
                  `
                }}
              />

              {/* Left Page (What the Fee Includes) */}
              <div className="w-full p-6 pt-10 pb-8 pl-16 pr-8 md:pl-16 md:pr-12 border-b-2 md:border-b-0 md:border-r-2 border-brand-ink relative z-10 flex flex-col justify-between min-h-[480px]">
                <div>
                  {/* Coffee stain on left page */}
                  <svg className="absolute w-36 h-36 text-amber-900/[0.04] pointer-events-none select-none -left-2 bottom-4 rotate-12 -z-5" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="140 10 30 10" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="80 40" />
                  </svg>

                  {/* Header Title (Handwritten double-underlined style) */}
                  <div className="mb-8 relative">
                    <h3 className="font-diary font-black text-2xl md:text-3xl tracking-wide text-brand-blue uppercase rotate-[-1deg]">
                      What the fee includes:
                    </h3>
                    <div className="h-1 w-44 bg-brand-orange mt-1 opacity-70 transform -skew-x-12" />
                    <div className="h-0.5 w-32 bg-brand-orange mt-0.5 opacity-50 transform -skew-x-12" />
                  </div>

                  {/* Ruled Paper Content List */}
                  <ul className="space-y-4 pl-1 text-left">
                    <li className="flex items-start gap-0 md:gap-3">
                      <span className="hidden md:inline-block font-diary font-black text-lg text-brand-orange select-none mt-1">✓</span>
                      <div>
                        <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                          Accommodation (Hostels)
                        </span>
                        <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                          Comfortable non-AC shared hostel stay during orientation.
                        </span>
                      </div>
                    </li>

                    <li className="flex items-start gap-0 md:gap-3">
                      <span className="hidden md:inline-block font-diary font-black text-lg text-brand-orange select-none mt-1">✓</span>
                      <div>
                        <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                          All Meals (Mess food)
                        </span>
                        <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                          Provided from registration day until orientation concludes.
                        </span>
                      </div>
                    </li>

                    <li className="flex items-start gap-0 md:gap-3">
                      <span className="hidden md:inline-block font-diary font-black text-lg text-brand-orange select-none mt-1">✓</span>
                      <div>
                        <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                          AARAMBH Kit
                        </span>
                        <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                          Includes official T-shirt, identity card, and other merchandise.
                        </span>
                      </div>
                    </li>

                    <li className="flex items-start gap-0 md:gap-3">
                      <span className="hidden md:inline-block font-diary font-black text-lg text-brand-orange select-none mt-1">✓</span>
                      <div>
                        <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                          Full Event Access
                        </span>
                        <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                          Workshops, creative sessions, games & outdoor activities.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Sticky Note for optional AC rooms */}
                <div className="mt-8 bg-[#fffae0] border-comic-thin p-3 rounded shadow-comic-sm transform -rotate-2 text-left z-20">
                  <p className="font-diary font-bold text-xs text-brand-ink leading-relaxed">
                    💡 AC rooms optional & charged separately at check-in (subject to availability, FCFS basis).
                  </p>
                </div>
              </div>

              {/* Right Page (Important Instructions) */}
              <div className="w-full p-6 pt-10 pb-8 pl-16 pr-8 md:pl-16 md:pr-10 relative z-10 flex flex-col justify-between min-h-[480px]">
                <div>
                  {/* Header Title (Handwritten double-underlined style) */}
                  <div className="mb-8 relative">
                    <h3 className="font-diary font-black text-2xl md:text-3xl tracking-wide text-brand-orange uppercase rotate-[1deg]">
                      Important Instructions:
                    </h3>
                    <div className="h-1 w-48 bg-brand-blue mt-1 opacity-70 transform -skew-x-12" />
                    <div className="h-0.5 w-36 bg-brand-blue mt-0.5 opacity-50 transform -skew-x-12" />
                  </div>

                  {/* Ruled Paper Content List */}
                  <ul className="space-y-4 pl-1 text-left">
                    <li className="flex items-start gap-0 md:gap-3">
                      <span className="hidden md:inline-block font-diary font-black text-lg text-brand-blue select-none mt-1">✏</span>
                      <div>
                        <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                          Accuracy is Key
                        </span>
                        <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                          Please enter the student&apos;s full name accurately during registration, even if paid by parent/guardian.
                        </span>
                      </div>
                    </li>

                    <li className="flex items-start gap-0 md:gap-3">
                      <span className="hidden md:inline-block font-diary font-black text-lg text-brand-blue select-none mt-1">✏</span>
                      <div>
                        <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                          Strictly Batch &apos;26 Only
                        </span>
                        <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                          Strictly for admitted batch 2026 students. Kindly avoid sharing the link outside.
                        </span>
                      </div>
                    </li>

                    <li className="flex items-start gap-0 md:gap-3">
                      <span className="hidden md:inline-block font-diary font-black text-lg text-brand-blue select-none mt-1">✏</span>
                      <div>
                        <span className="font-diary font-black text-lg md:text-xl text-brand-ink tracking-wide block leading-tight">
                          Parent/Guardian Access
                        </span>
                        <span className="font-sans font-semibold text-xs text-brand-ink/70 block mt-0.5">
                          Orientation events are strictly for students; parents/guardians are welcome to accompany them only for the inaugural session.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Sticky Note for payment gateway convenience fee */}
                <div className="mt-8 bg-[#e0f5ff] border-comic-thin p-3 rounded shadow-comic-sm transform rotate-1 text-left z-20">
                  <p className="font-diary font-bold text-xs text-brand-ink leading-relaxed">
                    ⚠️ Note: A 2% convenience fee is added during online payment due to Cashfree gateway charges.
                  </p>
                </div>
              </div>

              {/* Desktop Spiral Binder Column (Center of diary) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-between py-6 z-30 pointer-events-none hidden md:flex">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="w-12 h-6 relative flex items-center justify-center">
                    {/* Left Punch Hole */}
                    <div className="absolute left-1 w-2.5 h-2.5 rounded-full bg-brand-ink/90 shadow-inner" />
                    {/* Right Punch Hole */}
                    <div className="absolute right-1 w-2.5 h-2.5 rounded-full bg-brand-ink/90 shadow-inner" />
                    {/* Spiral Ring (bridges the pages) */}
                    <div className="w-12 h-4 rounded-full bg-gradient-to-b from-gray-300 via-white to-gray-400 border-2 border-brand-ink shadow-md transform rotate-[5deg] hover:rotate-[15deg] transition-transform duration-200" />
                  </div>
                ))}
              </div>

              {/* Mobile Spiral Binder Column (Left Edge of diary) */}
              <div className="absolute top-0 bottom-0 left-4 flex flex-col justify-between py-6 z-30 pointer-events-none flex md:hidden">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="w-8 h-5 relative flex items-center justify-center">
                    {/* Punch Hole */}
                    <div className="absolute right-1.5 w-2 h-2 rounded-full bg-brand-ink/90 shadow-inner" />
                    {/* Spiral Ring */}
                    <div className="w-8 h-3 rounded-full bg-gradient-to-b from-gray-300 via-white to-gray-400 border-2 border-brand-ink shadow-md transform rotate-[5deg]" />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Lower Section: Interactive Call-To-Action Card (Centered Below) */}
        <div className="flex flex-col items-center justify-center relative z-10 w-full pt-4">
          <p className="font-sans font-medium text-xs sm:text-sm text-brand-ink/70 mb-6 leading-normal text-center mx-auto max-w-md">
            Secure your place at the most welcoming, boundary-pushing orientation event.
          </p>
          
          <Link href="/register" className="w-full max-w-md block">
            <motion.button  
              whileHover={{ scale: 1.03, rotate: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full comic-interactive border-comic py-5 px-6 shadow-comic hover:shadow-solid-ink transition-all font-display font-black text-xl tracking-wide text-brand-cloud bg-brand-blue rounded-lg cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Register Now</span> 
              <span className="transform group-hover:translate-x-2 transition-transform duration-200">→</span>
            </motion.button>
          </Link>
        </div>

      </div>
    </section>
  );
}
