'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Check, Download } from 'lucide-react';

const STORAGE_PREFIX = 'aarambh-checklist-';

/* ── Single Checklist Row ── */
const ChecklistItem = ({
  label,
  accentColor,
  highlight = false,
}: {
  label: string;
  accentColor: string;
  highlight?: boolean;
}) => {
  const storageKey = `${STORAGE_PREFIX}${label.replace(/\s+/g, '-').toLowerCase()}`;

  const [checked, setChecked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on mount (SSR-safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'true') setChecked(true);
    } catch {}
    setHydrated(true);
  }, [storageKey]);

  const toggle = useCallback(() => {
    setChecked((prev) => {
      const next = !prev;
      try {
        if (next) {
          localStorage.setItem(storageKey, 'true');
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch {}
      return next;
    });
  }, [storageKey]);

  return (
    <li
      className="group relative rounded-lg cursor-pointer select-none transition-all duration-200"
      style={{
        backgroundColor: checked ? `${accentColor}08` : 'transparent',
        padding: '8px 10px',
        opacity: hydrated ? 1 : 0.6,
      }}
      onClick={toggle}
    >
      <div className="flex items-center gap-3">
        {/* ── Custom checkbox ── */}
        <div className="relative flex-shrink-0 w-5 h-5">
          {/* Box */}
          <div
            className="absolute inset-0 rounded border transition-all duration-200"
            style={{
              borderColor: checked ? accentColor : 'rgba(3, 4, 4, 0.2)',
              backgroundColor: checked ? accentColor : 'white',
            }}
          />
          {/* Checkmark SVG */}
          <svg
            className="absolute inset-0 w-full h-full p-0.5 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline
              points="20 6 9 17 4 12"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: checked ? 0 : 30,
                transition: 'stroke-dashoffset 0.2s cubic-bezier(0.65, 0, 0.35, 1)',
              }}
            />
          </svg>
        </div>

        {/* ── Label ── */}
        <div className="relative flex-1">
          <span
            className={`text-sm tracking-wide transition-colors duration-200 ${
              highlight && !checked 
                ? 'font-bold px-1.5 py-0.5 rounded-sm' 
                : checked 
                ? 'font-medium text-brand-ink/40 line-through' 
                : 'font-medium text-brand-ink'
            }`}
            style={{
              backgroundColor: highlight && !checked ? `${accentColor}15` : 'transparent',
              color: highlight && !checked ? accentColor : undefined
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </li>
  );
};

/* ── Main Component ── */
export default function PackingChecklist() {
  return (
    <section className="py-20 px-6 w-full max-w-7xl mx-auto relative z-10 font-sans">
      <div className="relative p-8 md:p-12 bg-[#F5F1E5] border border-brand-ink/10 rounded-2xl shadow-md">
        
        {/* Heading Block */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase leading-none tracking-tight text-brand-ink mb-4">
            Essential <span className="text-brand-orange">Packing</span> Checklist
          </h2>
          <p className="text-sm md:text-base font-medium max-w-xl text-brand-ink/70 tracking-wide mb-6">
            Gear up for the next chapter. Tick off your items below to track your readiness for the journey.
          </p>
          
          <a 
            href="https://storage.googleapis.com/aarambh-26-assets/Essesntial%20Packing%20Checklist.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Essential Packing Checklist.pdf"
            className="py-3 px-6 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold text-sm uppercase tracking-wider rounded-lg shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 z-20 cursor-pointer"
          >
            <Download size={16} />
            Download Checklist
          </a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 pb-4">

          {/* Card 1: Clothing & Gear */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-5 shadow-sm">
            <div className="border-b border-brand-ink/10 pb-3 mb-3">
              <h3 className="font-bold text-base tracking-wide text-brand-blue uppercase">Clothing & Gear</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#184176" label="Casual wear (t-shirts, jeans, shorts)" />
              <ChecklistItem accentColor="#184176" label="Formal wear (shirts, trousers, dress)" />
              <ChecklistItem accentColor="#184176" label="Seasonal clothing (jackets, sweaters)" />
              <ChecklistItem accentColor="#184176" label="Undergarments and socks" />
              <ChecklistItem accentColor="#184176" label="Sleepwear and loungewear" />
              <ChecklistItem accentColor="#184176" label="Footwear (sneakers, sandals, formals)" />
            </ul>
          </div>

          {/* Card 2: Academics */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-5 shadow-sm">
            <div className="border-b border-brand-ink/10 pb-3 mb-3">
              <h3 className="font-bold text-base tracking-wide text-[#215798] uppercase">Academics</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#215798" label="Laptop / computer & charger" />
              <ChecklistItem accentColor="#215798" label="Notebooks and Writing Pads" />
              <ChecklistItem accentColor="#215798" label="Pens, pencils, and highlighters" />
              <ChecklistItem accentColor="#215798" label="Calculator (scientific)" />
              <ChecklistItem accentColor="#215798" label="Laptop Bag" />
            </ul>
          </div>

          {/* Card 3: Room & Living */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-5 shadow-sm">
            <div className="border-b border-brand-ink/10 pb-3 mb-3">
              <h3 className="font-bold text-base tracking-wide text-[#f5821e] uppercase">Room & Living</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#f5821e" label="Bed sheets, pillow & cover" />
              <ChecklistItem accentColor="#f5821e" label="Blankets and Comforter" />
              <ChecklistItem accentColor="#f5821e" label="Umbrella (Important! Rain Alert)" highlight />
              <ChecklistItem accentColor="#f5821e" label="Desk lamp" />
              <ChecklistItem accentColor="#f5821e" label="Laundry basket & detergent" />
            </ul>
          </div>

          {/* Card 4: Kitchen & Food */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-5 shadow-sm">
            <div className="border-b border-brand-ink/10 pb-3 mb-3">
              <h3 className="font-bold text-base tracking-wide text-[#215798] uppercase">Kitchen & Food</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#215798" label="Water bottle" />
              <ChecklistItem accentColor="#215798" label="Coffee/tea mug" />
              <ChecklistItem accentColor="#215798" label="Basic utensils (for induction)" />
              <ChecklistItem accentColor="#215798" label="Plates and Bowls" />
              <ChecklistItem accentColor="#215798" label="Non-perishable snacks" />
            </ul>
          </div>

          {/* Card 5: Official Docs */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-5 shadow-sm">
            <div className="border-b border-brand-ink/10 pb-3 mb-3">
              <h3 className="font-bold text-base tracking-wide text-[#f5821e] uppercase">Official Docs</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#f5821e" label="Admission letter & documents" />
              <ChecklistItem accentColor="#f5821e" label="Academic transcripts" />
              <ChecklistItem accentColor="#f5821e" label="Government-issued IDs" />
              <ChecklistItem accentColor="#f5821e" label="Bank account information" />
              <ChecklistItem accentColor="#f5821e" label="Emergency contacts" />
            </ul>
          </div>

          {/* Card 6: Health & Care */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-5 shadow-sm">
            <div className="border-b border-brand-ink/10 pb-3 mb-3">
              <h3 className="font-bold text-base tracking-wide text-[#184176] uppercase">Health & Care</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#184176" label="First aid kit" />
              <ChecklistItem accentColor="#184176" label="Prescription medications" />
              <ChecklistItem accentColor="#184176" label="Vitamins & supplements" />
              <ChecklistItem accentColor="#184176" label="Thermometer" />
              <ChecklistItem accentColor="#184176" label="Hand sanitizer & Face masks" />
            </ul>
          </div>

          {/* Card 7: Tech Gear */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-5 shadow-sm">
            <div className="border-b border-brand-ink/10 pb-3 mb-3">
              <h3 className="font-bold text-base tracking-wide text-[#f5821e] uppercase">Tech Gear</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#f5821e" label="Power Bank" />
              <ChecklistItem accentColor="#f5821e" label="Extension cord" />
              <ChecklistItem accentColor="#f5821e" label="Headphones or earbuds" />
              <ChecklistItem accentColor="#f5821e" label="Speakers (respectful volume)" />
            </ul>
          </div>

          {/* Card 8: Recreation */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-5 shadow-sm">
            <div className="border-b border-brand-ink/10 pb-3 mb-3">
              <h3 className="font-bold text-base tracking-wide text-[#184176] uppercase">Recreation</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#184176" label="Books for leisure reading" />
              <ChecklistItem accentColor="#184176" label="Board games or playing cards" />
              <ChecklistItem accentColor="#184176" label="Sports equipment" />
              <ChecklistItem accentColor="#184176" label="Musical instruments" />
              <ChecklistItem accentColor="#184176" label="Art supplies" />
            </ul>
          </div>

          {/* Card 9: Toiletries & Grooming */}
          <div className="bg-white border border-brand-ink/10 rounded-xl p-5 shadow-sm">
            <div className="border-b border-brand-ink/10 pb-3 mb-3">
              <h3 className="font-bold text-base tracking-wide text-[#215798] uppercase">Toiletries & Grooming</h3>
            </div>
            <ul className="space-y-0.5">
              <ChecklistItem accentColor="#215798" label="Bath towels & hand towels" />
              <ChecklistItem accentColor="#215798" label="Toothbrush, toothpaste & mouthwash" />
              <ChecklistItem accentColor="#215798" label="Shampoo, conditioner & body wash" />
              <ChecklistItem accentColor="#215798" label="Comb, hairbrush & nail clippers" />
              <ChecklistItem accentColor="#215798" label="Trimmer / grooming kit" />
              <ChecklistItem accentColor="#215798" label="Bucket, mug & bathroom slippers" />
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
