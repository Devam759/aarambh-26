'use client';
import React from 'react';

export default function PackingChecklist() {
  return (
    <section className="py-24 px-6 w-full max-w-7xl mx-auto relative z-10 font-sans">
      <div className="bg-brand-cloud border-comic p-8 md:p-14 rounded-xl shadow-comic">

        {/* Heading Block */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase leading-none tracking-tighter text-brand-ink mb-4">
            Essential <span className="text-brand-pink">Packing</span> Checklist
          </h2>
          <p className="text-sm md:text-base font-display font-bold max-w-xl text-brand-ink/80 uppercase tracking-wide">
            Gear up for the next chapter. Tick off your items below to track your readiness for AARAMBH '26.
          </p>
        </div>

        {/* Interactive Motivation Banner */}
        <div id="quote-banner" className="bg-white border-comic rounded-lg p-4 mb-16 text-center shadow-comic-sm transition-all duration-300 max-w-2xl mx-auto -rotate-1">
          <p id="quote-text" className="text-xs md:text-sm font-display font-black uppercase tracking-wider text-brand-ink">
            Ready to break conventions? Start checking items to begin your journey Beyond!
          </p>
        </div>

        {/* Distorted & Colorful Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-8">

          {/* Card 1: Clothing & Gear */}
          <div className="bg-white border-comic rounded-xl p-6 shadow-comic transition-all hover:scale-[1.01] hover:-rotate-1 duration-300 rotate-1">
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-display font-black text-xl tracking-tight text-brand-ink uppercase">Clothing & Gear</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Casual wear (t-shirts, jeans, shorts)</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Formal wear (shirts, trousers, dress)</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Seasonal clothing (jackets, sweaters)</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Undergarments and socks</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Sleepwear and loungewear</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Footwear (sneakers, sandals, formals)</span></li>
            </ul>
          </div>

          {/* Card 2: Academics */}
          <div className="bg-white border-comic rounded-xl p-6 shadow-comic transition-all hover:scale-[1.01] hover:rotate-1 duration-300 -rotate-1">
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-display font-black text-xl tracking-tight text-brand-ink uppercase">Academics</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Laptop / computer & charger</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Notebooks and Writing Pads</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Pens, pencils, and highlighters</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Calculator (scientific)</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Laptop Bag</span></li>
            </ul>
          </div>

          {/* Card 3: Room & Living */}
          <div className="bg-white border-comic rounded-xl p-6 shadow-comic transition-all hover:scale-[1.01] hover:-rotate-1 duration-300 rotate-2">
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-display font-black text-xl tracking-tight text-brand-ink uppercase">Room & Living</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Bed sheets, pillow & cover</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Blankets and Comforter</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span className="text-brand-ink font-bold underline decoration-brand-pink decoration-2">Umbrella (Important! Rain Alert)</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Desk lamp</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Laundry basket & detergent</span></li>
            </ul>
          </div>

          {/* Card 4: Kitchen & Food */}
          <div className="bg-white border-comic rounded-xl p-6 shadow-comic transition-all hover:scale-[1.01] hover:rotate-1 duration-300 -rotate-2">
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-display font-black text-xl tracking-tight text-brand-ink uppercase">Kitchen & Food</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Water bottle</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Coffee/tea mug</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Basic utensils (for induction)</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Plates and Bowls</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Non-perishable snacks</span></li>
            </ul>
          </div>

          {/* Card 5: Official Docs */}
          <div className="bg-white border-comic rounded-xl p-6 shadow-comic transition-all hover:scale-[1.01] hover:-rotate-1 duration-300 rotate-1">
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-display font-black text-xl tracking-tight text-brand-ink uppercase">Official Docs</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Admission letter & documents</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Academic transcripts</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Government-issued IDs</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Bank account information</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Emergency contacts</span></li>
            </ul>
          </div>

          {/* Card 6: Health & Care */}
          <div className="bg-white border-comic rounded-xl p-6 shadow-comic transition-all hover:scale-[1.01] hover:rotate-1 duration-300 -rotate-1">
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-display font-black text-xl tracking-tight text-brand-ink uppercase">Health & Care</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>First aid kit</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Prescription medications</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Vitamins & supplements</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Thermometer</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Hand sanitizer & Face masks</span></li>
            </ul>
          </div>

          {/* Card 7: Tech Gear */}
          <div className="bg-white border-comic rounded-xl p-6 shadow-comic transition-all hover:scale-[1.01] hover:-rotate-1 duration-300 rotate-2">
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-display font-black text-xl tracking-tight text-brand-ink uppercase">Tech Gear</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Power Bank</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Extension cord</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Headphones or earbuds</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Speakers (respectful volume)</span></li>
            </ul>
          </div>

          {/* Card 8: Recreation */}
          <div className="bg-white border-comic rounded-xl p-6 shadow-comic transition-all hover:scale-[1.01] hover:rotate-1 duration-300 -rotate-1">
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-display font-black text-xl tracking-tight text-brand-ink uppercase">Recreation</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Books for leisure reading</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Board games or playing cards</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Sports equipment</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Musical instruments</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Art supplies</span></li>
            </ul>
          </div>

          {/* Card 9: Toiletries & Grooming */}
          <div className="bg-white border-comic rounded-xl p-6 shadow-comic transition-all hover:scale-[1.01] hover:-rotate-1 duration-300 rotate-1">
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-display font-black text-xl tracking-tight text-brand-ink uppercase">Toiletries & Grooming</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Bath towels & hand towels</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Toothbrush, toothpaste & mouthwash</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Shampoo, conditioner & body wash</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Comb, hairbrush & nail clippers</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Trimmer / grooming kit</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Bucket, mug & bathroom slippers</span></li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
