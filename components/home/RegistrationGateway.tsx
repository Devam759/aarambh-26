'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegistrationGateway() {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 w-full max-w-5xl relative z-10 mx-auto">
      <div className="relative border-comic bg-brand-cloud text-brand-ink shadow-comic p-8 sm:p-16 lg:p-20 rounded-xl overflow-hidden flex flex-col items-center text-center gap-12">

        {/* Upper Section: Clean Typography & Messaging (Centered) */}
        <div className="flex flex-col items-center text-center relative z-10 w-full max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-ink text-brand-cloud font-display text-[10px] md:text-xs font-black tracking-widest rounded-lg mb-6 shadow-comic-sm border-comic-thin">
            <span className="w-2 h-2 rounded-full bg-brand-pink animate-ping" />
            Your Registration Gateway
          </div>

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

        {/* Dynamic Structured Content Container (All Sections Center Aligned) */}
        <div className="w-full max-w-3xl flex flex-col gap-8 relative z-10 text-center items-center">


          {/* BOX 2: WHAT THE FEE INCLUDES */}
          <div className="w-full bg-white border-comic p-6 sm:p-10 rounded-xl shadow-comic flex flex-col items-center">
            <h3 className="font-display font-black text-lg sm:text-xl tracking-tight mb-6 text-brand-ink pb-2 border-b-2 border-brand-pink inline-block uppercase">
              What the fee includes
            </h3>

            <div className="flex flex-col gap-4 w-full max-w-xl text-center">
              <div className="bg-brand-cloud/40 p-4 border-2 border-brand-ink/15 rounded-lg flex flex-col items-center">
                <span className="font-display font-black text-xs sm:text-sm text-brand-pink tracking-wide mb-1 uppercase">Non-AC Shared Accommodation</span>
                <p className="font-sans font-medium text-xs text-brand-ink/70">Comfortable stay in campus hostels throughout the orientation program.</p>
              </div>

              <div className="bg-brand-cloud/40 p-4 border-2 border-brand-ink/15 rounded-lg flex flex-col items-center">
                <span className="font-display font-black text-xs sm:text-sm text-brand-pink tracking-wide mb-1 uppercase">All Meals</span>
                <p className="font-sans font-medium text-xs text-brand-ink/70">Mess food provided from the day of registration until the conclusion of AARAMBH.</p>
              </div>

              <div className="bg-brand-cloud/40 p-4 border-2 border-brand-ink/15 rounded-lg flex flex-col items-center">
                <span className="font-display font-black text-xs sm:text-sm text-brand-pink tracking-wide mb-1 uppercase">AARAMBH Kit</span>
                <p className="font-sans font-medium text-xs text-brand-ink/70">Includes official merchandise (T-shirts, ID card, and more).</p>
              </div>

              <div className="bg-brand-cloud/40 p-4 border-2 border-brand-ink/15 rounded-lg flex flex-col items-center">
                <span className="font-display font-black text-xs sm:text-sm text-brand-pink tracking-wide mb-1 uppercase">Full Access</span>
                <p className="font-sans font-medium text-xs text-brand-ink/70">Entry to all workshops, creative sessions, team-building events, and outdoor group activities.</p>
              </div>
            </div>
          </div>

          {/* BOX 3: IMPORTANT INSTRUCTIONS */}
          <div className="w-full bg-white border-comic p-6 sm:p-10 rounded-xl shadow-comic flex flex-col items-center">
            <h3 className="font-display font-black text-lg sm:text-xl tracking-tight mb-6 text-brand-ink pb-2 border-b-2 border-brand-ink inline-block uppercase">
              Important Instructions
            </h3>

            <div className="flex flex-col gap-4 w-full max-w-xl text-center">
              <div className="border-2 border-brand-ink/15 p-4 rounded-lg bg-brand-cloud/30 font-sans font-medium text-xs sm:text-sm text-brand-ink leading-relaxed">
                Please enter the <span className="text-brand-pink font-bold">student&apos;s full name accurately</span> during registration, even if the payment is made by a parent or guardian.
              </div>

              <div className="border-2 border-brand-ink/15 p-4 rounded-lg bg-brand-cloud/30 font-sans font-medium text-xs sm:text-sm text-brand-ink leading-relaxed">
                This registration is <span className="text-brand-pink font-bold">strictly for admitted students</span> of JKLU Batch 2026. Kindly avoid sharing the link outside the eligible group.
              </div>

              <div className="border-2 border-brand-ink/15 p-4 rounded-lg bg-brand-cloud/30 font-sans font-medium text-xs sm:text-sm text-brand-ink leading-relaxed">
                Mention your <span className="text-brand-pink font-bold">JKLU Application Number</span> to ensure proper identification and confirmation.
              </div>
            </div>
          </div>

        </div>

        {/* Lower Section: Interactive Call-To-Action Card (Centered Below) */}
        <div className="flex flex-col items-center justify-center relative z-10 w-full pt-4">
          <div className="w-full max-w-md border-comic bg-brand-cloud p-6 sm:p-8 rounded-xl shadow-comic transform transition-transform duration-300 hover:scale-[1.01]">
            <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight mb-2 text-brand-ink text-center uppercase">
              Register
            </h3>
            <p className="font-sans font-medium text-xs text-brand-ink/70 mb-6 leading-normal text-center mx-auto max-w-xs">
              Secure your place at the most fearless orientation event.
            </p>

            <Link href="/register" className="w-full block">
              <motion.button
                whileHover={{ scale: 1.03, rotate: -1 }}
                whileTap={{ scale: 0.97 }}
                className="w-full comic-interactive border-comic py-5 px-6 shadow-comic hover:shadow-solid-ink transition-all font-display font-black text-xl tracking-wide text-brand-cloud bg-brand-pink rounded-lg cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Register Online Now</span>
                <span className="transform group-hover:translate-x-2 transition-transform duration-200">→</span>
              </motion.button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
