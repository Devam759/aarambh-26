'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Info, AlertTriangle } from 'lucide-react';

export default function RegistrationSection() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 w-full max-w-5xl relative z-10 mx-auto font-sans">
      <div className="relative border border-brand-ink/10 bg-brand-cloud/85 text-brand-ink shadow-lg p-8 sm:p-12 lg:p-16 rounded-2xl overflow-hidden flex flex-col items-center text-center gap-10">

        {/* Upper Section: Clean Typography & Messaging */}
        <div className="flex flex-col items-center text-center relative z-10 w-full max-w-3xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight mb-4 text-center text-brand-ink">
            Aarambh 2026 <br />
            <span className="text-brand-orange">Registration</span>
          </h2>

          <p className="text-brand-ink/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium text-center">
            Kickstart your JKLU journey with a registration fee of ₹2,500 (Non-refundable) covering all essentials for a vibrant and welcoming orientation experience.
          </p>
        </div>

        {/* Informational Cards Grid (Replaces Spiral Notebook) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative z-10 my-2 text-left">
          {/* Card 1: What the Fee Includes */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-display font-black text-lg md:text-xl text-brand-blue uppercase tracking-wider mb-6">
                What the fee includes
              </h3>
              
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-brand-blue/10 p-0.5 rounded">
                    <Check size={14} className="text-brand-blue stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-brand-ink block leading-tight">
                      Accommodation (Hostels)
                    </span>
                    <span className="text-xs text-brand-ink/70 block mt-1">
                      Comfortable non-AC shared hostel stay during orientation.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-brand-blue/10 p-0.5 rounded">
                    <Check size={14} className="text-brand-blue stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-brand-ink block leading-tight">
                      All Meals (Mess food)
                    </span>
                    <span className="text-xs text-brand-ink/70 block mt-1">
                      Provided from registration day until orientation concludes.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-brand-blue/10 p-0.5 rounded">
                    <Check size={14} className="text-brand-blue stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-brand-ink block leading-tight">
                      Aarambh Kit
                    </span>
                    <span className="text-xs text-brand-ink/70 block mt-1">
                      Includes official T-shirt, identity card, and other merchandise.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-brand-blue/10 p-0.5 rounded">
                    <Check size={14} className="text-brand-blue stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-brand-ink block leading-tight">
                      Full Event Access
                    </span>
                    <span className="text-xs text-brand-ink/70 block mt-1">
                      Workshops, creative sessions, games & outdoor activities.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Note Box */}
            <div className="mt-8 bg-brand-blue/5 border border-brand-blue/10 p-4 rounded-lg flex gap-2.5 items-start">
              <Info size={16} className="text-brand-blue shrink-0 mt-0.5" />
              <p className="text-xs text-brand-ink/80 leading-relaxed font-medium">
                AC rooms are optional and charged separately at check-in, subject to availability on a first-come, first-served basis.
              </p>
            </div>
          </div>

          {/* Card 2: Important Instructions */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-display font-black text-lg md:text-xl text-brand-orange uppercase tracking-wider mb-6">
                Important Instructions
              </h3>
              
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-brand-orange/10 p-0.5 rounded">
                    <Info size={14} className="text-brand-orange stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-brand-ink block leading-tight">
                      Accuracy is Key
                    </span>
                    <span className="text-xs text-brand-ink/70 block mt-1">
                      Please enter the student's full name accurately during registration, even if payment is made by a parent or guardian.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-brand-orange/10 p-0.5 rounded">
                    <Info size={14} className="text-brand-orange stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-brand-ink block leading-tight">
                      Strictly Batch '26 Only
                    </span>
                    <span className="text-xs text-brand-ink/70 block mt-1">
                      Strictly for admitted batch 2026 students. Kindly avoid sharing the link outside.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-brand-orange/10 p-0.5 rounded">
                    <Info size={14} className="text-brand-orange stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-brand-ink block leading-tight">
                      Parent/Guardian Access
                    </span>
                    <span className="text-xs text-brand-ink/70 block mt-1">
                      Orientation events are strictly for students; parents and guardians are welcome to accompany them only for the inaugural session.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Note Box */}
            <div className="mt-8 bg-brand-orange/5 border border-brand-orange/10 p-4 rounded-lg flex gap-2.5 items-start">
              <AlertTriangle size={16} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-xs text-brand-ink/80 leading-relaxed font-medium">
                Note: A 2% convenience fee is added during online payment due to Cashfree gateway charges.
              </p>
            </div>
          </div>
        </div>

        {/* Lower Section: Call-To-Action (Centered Below) */}
        <div className="flex flex-col items-center justify-center relative z-10 w-full pt-2">
          <p className="text-xs sm:text-sm text-brand-ink/70 mb-6 leading-normal text-center max-w-md font-medium">
            Secure your place at the most welcoming, boundary-pushing orientation event.
          </p>
          
          <Link href="/register" className="w-full max-w-md block">
            <motion.button  
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold text-lg tracking-wide rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Register Now</span> 
              <span className="transform group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </motion.button>
          </Link>
        </div>

      </div>
    </section>
  );
}
