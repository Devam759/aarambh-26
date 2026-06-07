'use client';
import React from 'react';

export default function PackingChecklist() {
  const handleDownload = () => {
    const checklistData = {
      "Clothing & Gear": [
        "Casual wear (t-shirts, jeans, shorts)",
        "Formal wear (shirts, trousers, dress)",
        "Seasonal clothing (jackets, sweaters)",
        "Undergarments and socks",
        "Sleepwear and loungewear",
        "Footwear (sneakers, sandals, formals)"
      ],
      "Academics": [
        "Laptop / computer & charger",
        "Notebooks and Writing Pads",
        "Pens, pencils, and highlighters",
        "Calculator (scientific)",
        "Laptop Bag"
      ],
      "Room & Living": [
        "Bed sheets, pillow & cover",
        "Blankets and Comforter",
        "Umbrella (Important! Rain Alert)",
        "Desk lamp",
        "Laundry basket & detergent"
      ],
      "Kitchen & Food": [
        "Water bottle",
        "Coffee/tea mug",
        "Basic utensils (for induction)",
        "Plates and Bowls",
        "Non-perishable snacks"
      ],
      "Official Docs": [
        "Admission letter & documents",
        "Academic transcripts",
        "Government-issued IDs",
        "Bank account information",
        "Emergency contacts"
      ],
      "Health & Care": [
        "First aid kit",
        "Prescription medications",
        "Vitamins & supplements",
        "Thermometer",
        "Hand sanitizer & Face masks"
      ],
      "Tech Gear": [
        "Power Bank",
        "Extension cord",
        "Headphones or earbuds",
        "Speakers (respectful volume)"
      ],
      "Recreation": [
        "Books for leisure reading",
        "Board games or playing cards",
        "Sports equipment",
        "Musical instruments",
        "Art supplies"
      ],
      "Toiletries & Grooming": [
        "Bath towels & hand towels",
        "Toothbrush, toothpaste & mouthwash",
        "Shampoo, conditioner & body wash",
        "Comb, hairbrush & nail clippers",
        "Trimmer / grooming kit",
        "Bucket, mug & bathroom slippers"
      ]
    };

    let text = `==================================================\n`;
    text += `          AARAMBH '26 PACKING CHECKLIST           \n`;
    text += `==================================================\n\n`;
    text += `Get ready for your college journey! Here is your custom checklist:\n\n`;

    Object.entries(checklistData).forEach(([category, items]) => {
      text += `[ ] ${category.toUpperCase()}\n`;
      items.forEach(item => {
        text += `    _ ${item}\n`;
      });
      text += `\n`;
    });

    text += `==================================================\n`;
    text += `Generated from Aarambh '26 orientation portal.\n`;
    text += `==================================================\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Aarambh_26_Packing_Checklist.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-24 px-6 w-full max-w-7xl mx-auto relative z-10 font-sans">
      {/* SVG displacement filter for torn paper edges */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <filter id="torn-card-filter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div className="relative p-8 md:p-14 bg-transparent">
        {/* Distressed/Grunge Box Background Layer */}
        <div 
          className="absolute inset-0 bg-[#F5F1E5] border-comic rounded-xl shadow-comic -z-10"
          style={{
            filter: 'url(#torn-card-filter)',
            backgroundImage: `
              linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 48%, rgba(255,255,255,0.6) 49%, rgba(0,0,0,0.18) 50%, rgba(255,255,255,0) 51%, rgba(255,255,255,0) 100%),
              linear-gradient(65deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0.5) 29%, rgba(0,0,0,0.15) 30%, rgba(255,255,255,0) 31%, rgba(255,255,255,0) 100%),
              linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 73%, rgba(255,255,255,0.4) 74%, rgba(0,0,0,0.15) 75%, rgba(255,255,255,0) 76%, rgba(255,255,255,0) 100%),
              radial-gradient(circle, transparent 75%, rgba(139, 90, 43, 0.08) 95%, rgba(100, 60, 20, 0.15) 100%)
            `
          }}
        />
        {/* Noise/Grunge Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none select-none opacity-[0.06] mix-blend-multiply -z-5"
          style={{
            filter: 'url(#torn-card-filter)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
        {/* Tape & Sticker Vibe: Scrapbook Designer Washi Tape Elements (Stripe Style) */}
        {/* Top Left Tape */}
        <div 
          className="absolute -top-4 -left-4 w-28 md:w-36 h-8 md:h-10 z-20 -rotate-12 pointer-events-none select-none border-y-2 border-brand-ink shadow-[1px_2px_3px_rgba(0,0,0,0.15)]"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 97% 10%, 100% 20%, 98% 30%, 100% 40%, 97% 50%, 100% 60%, 98% 70%, 100% 80%, 97% 90%, 100% 100%, 0% 100%, 3% 90%, 0% 80%, 2% 70%, 0% 60%, 3% 50%, 0% 40%, 2% 30%, 0% 20%, 3% 10%)',
            background: 'repeating-linear-gradient(-45deg, #FF188C, #FF188C 6px, #030404 6px, #030404 12px)'
          }}
        />
        {/* Top Right Tape */}
        <div 
          className="absolute -top-4 -right-4 w-28 md:w-36 h-8 md:h-10 z-20 rotate-12 pointer-events-none select-none border-y-2 border-brand-ink shadow-[1px_2px_3px_rgba(0,0,0,0.15)]"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 97% 10%, 100% 20%, 98% 30%, 100% 40%, 97% 50%, 100% 60%, 98% 70%, 100% 80%, 97% 90%, 100% 100%, 0% 100%, 3% 90%, 0% 80%, 2% 70%, 0% 60%, 3% 50%, 0% 40%, 2% 30%, 0% 20%, 3% 10%)',
            background: 'repeating-linear-gradient(-45deg, #FF188C, #FF188C 6px, #030404 6px, #030404 12px)'
          }}
        />
        {/* Bottom Left Tape */}
        <div 
          className="absolute -bottom-4 -left-4 w-28 md:w-36 h-8 md:h-10 z-20 rotate-12 pointer-events-none select-none border-y-2 border-brand-ink shadow-[1px_2px_3px_rgba(0,0,0,0.15)]"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 97% 10%, 100% 20%, 98% 30%, 100% 40%, 97% 50%, 100% 60%, 98% 70%, 100% 80%, 97% 90%, 100% 100%, 0% 100%, 3% 90%, 0% 80%, 2% 70%, 0% 60%, 3% 50%, 0% 40%, 2% 30%, 0% 20%, 3% 10%)',
            background: 'repeating-linear-gradient(-45deg, #FF188C, #FF188C 6px, #030404 6px, #030404 12px)'
          }}
        />
        {/* Bottom Right Tape */}
        <div 
          className="absolute -bottom-4 -right-4 w-28 md:w-36 h-8 md:h-10 z-20 -rotate-12 pointer-events-none select-none border-y-2 border-brand-ink shadow-[1px_2px_3px_rgba(0,0,0,0.15)]"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 97% 10%, 100% 20%, 98% 30%, 100% 40%, 97% 50%, 100% 60%, 98% 70%, 100% 80%, 97% 90%, 100% 100%, 0% 100%, 3% 90%, 0% 80%, 2% 70%, 0% 60%, 3% 50%, 0% 40%, 2% 30%, 0% 20%, 3% 10%)',
            background: 'repeating-linear-gradient(-45deg, #FF188C, #FF188C 6px, #030404 6px, #030404 12px)'
          }}
        />

        {/* Heading Block */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bricks font-black uppercase leading-none tracking-wide text-brand-ink mb-4">
            Essential <span className="text-brand-pink">Packing</span> Checklist
          </h2>
          <p className="text-sm md:text-base font-display font-bold max-w-xl text-brand-ink/80 uppercase tracking-wide mb-6">
            Gear up for the next chapter. Tick off your items below to track your readiness for AARAMBH '26.
          </p>
          <button 
            onClick={handleDownload}
            className="comic-interactive border-comic-thin py-3 px-6 bg-brand-pink text-white font-display font-black text-sm uppercase tracking-wider rounded-lg shadow-comic-sm cursor-pointer hover:shadow-solid-ink active:scale-[0.98] transition-all flex items-center gap-2 z-20"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download Checklist (.txt)
          </button>
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
          <div className="relative p-6">
            <div 
              className="absolute inset-0 bg-[#ffb7db] border-comic rounded-xl shadow-comic -z-10"
              style={{ filter: 'url(#torn-card-filter)' }}
            />
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-bricks font-black text-xl tracking-tight text-brand-ink uppercase">Clothing & Gear</h3>
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
          <div className="relative p-6">
            <div 
              className="absolute inset-0 bg-[#b4bef4] border-comic rounded-xl shadow-comic -z-10"
              style={{ filter: 'url(#torn-card-filter)' }}
            />
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-bricks font-black text-xl tracking-tight text-brand-ink uppercase">Academics</h3>
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
          <div className="relative p-6">
            <div 
              className="absolute inset-0 bg-[#ffe0b0] border-comic rounded-xl shadow-comic -z-10"
              style={{ filter: 'url(#torn-card-filter)' }}
            />
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-bricks font-black text-xl tracking-tight text-brand-ink uppercase">Room & Living</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Bed sheets, pillow & cover</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Blankets and Comforter</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span className="text-brand-ink font-bold underline decoration-brand-orange decoration-2">Umbrella (Important! Rain Alert)</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Desk lamp</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Laundry basket & detergent</span></li>
            </ul>
          </div>

          {/* Card 4: Kitchen & Food */}
          <div className="relative p-6">
            <div 
              className="absolute inset-0 bg-[#b4bef4] border-comic rounded-xl shadow-comic -z-10"
              style={{ filter: 'url(#torn-card-filter)' }}
            />
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-bricks font-black text-xl tracking-tight text-brand-ink uppercase">Kitchen & Food</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Water bottle</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Coffee/tea mug</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Basic utensils (for induction)</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Plates and Bowls</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Non-perishable snacks</span></li>
            </ul>
          </div>

          {/* Card 5: Official Docs */}
          <div className="relative p-6">
            <div 
              className="absolute inset-0 bg-[#ffe0b0] border-comic rounded-xl shadow-comic -z-10"
              style={{ filter: 'url(#torn-card-filter)' }}
            />
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-bricks font-black text-xl tracking-tight text-brand-ink uppercase">Official Docs</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Admission letter & documents</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Academic transcripts</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Government-issued IDs</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Bank account information</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Emergency contacts</span></li>
            </ul>
          </div>

          {/* Card 6: Health & Care */}
          <div className="relative p-6">
            <div 
              className="absolute inset-0 bg-[#ffb7db] border-comic rounded-xl shadow-comic -z-10"
              style={{ filter: 'url(#torn-card-filter)' }}
            />
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-bricks font-black text-xl tracking-tight text-brand-ink uppercase">Health & Care</h3>
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
          <div className="relative p-6">
            <div 
              className="absolute inset-0 bg-[#ffe0b0] border-comic rounded-xl shadow-comic -z-10"
              style={{ filter: 'url(#torn-card-filter)' }}
            />
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-bricks font-black text-xl tracking-tight text-brand-ink uppercase">Tech Gear</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Power Bank</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Extension cord</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Headphones or earbuds</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-orange cursor-pointer" /><span>Speakers (respectful volume)</span></li>
            </ul>
          </div>

          {/* Card 8: Recreation */}
          <div className="relative p-6">
            <div 
              className="absolute inset-0 bg-[#ffb7db] border-comic rounded-xl shadow-comic -z-10"
              style={{ filter: 'url(#torn-card-filter)' }}
            />
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-bricks font-black text-xl tracking-tight text-brand-ink uppercase">Recreation</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Books for leisure reading</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Board games or playing cards</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Sports equipment</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Musical instruments</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-pink cursor-pointer" /><span>Art supplies</span></li>
            </ul>
          </div>

          {/* Card 9: Toiletries & Grooming */}
          <div className="relative p-6">
            <div 
              className="absolute inset-0 bg-[#b4bef4] border-comic rounded-xl shadow-comic -z-10"
              style={{ filter: 'url(#torn-card-filter)' }}
            />
            <div className="border-b-2 border-brand-ink pb-3 mb-4">
              <h3 className="font-bricks font-black text-xl tracking-tight text-brand-ink uppercase">Toiletries & Grooming</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium tracking-wide text-brand-ink">
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Bath towels & hand towels</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Toothbrush, toothpaste & mouthwash</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Shampoo, conditioner & body wash</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Comb, hairbrush & nail clippers</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Trimmer / grooming kit</span></li>
              <li className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-brand-cloud/40"><input type="checkbox" className="checklist-item w-5 h-5 accent-brand-blue cursor-pointer" /><span>Bucket, mug & bathroom slippers</span></li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
