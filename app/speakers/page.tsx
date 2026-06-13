'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { playSynthSound } from '@/lib/sounds';

const LinkedInIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const THEMES = [
  { primary: '#FF188C', highlight: '#FF9A00', accent: '#0D21DD' },
  { primary: '#FF9A00', highlight: '#FF188C', accent: '#030404' },
  { primary: '#030404', highlight: '#FF9A00', accent: '#FF188C' },
  { primary: '#FF188C', highlight: '#FF188C', accent: '#FF9A00' },
  { primary: '#FF9A00', highlight: '#FF9A00', accent: '#FF188C' },
  { primary: '#030404', highlight: '#FF188C', accent: '#FF9A00' },
  { primary: '#FF188C', highlight: '#FF9A00', accent: '#030404' },
  { primary: '#FF9A00', highlight: '#FF188C', accent: '#030404' },
  { primary: '#030404', highlight: '#FF9A00', accent: '#FF188C' },
];

const CARD_COLORS = [
  { border: '#FF188C', shadow: '#030404', bg: '#FF9A00', text: '#F5F1E5' },
  { border: '#030404', shadow: '#FF188C', bg: '#FF188C', text: '#F5F1E5' },
  { border: '#FF9A00', shadow: '#030404', bg: '#FF9A00', text: '#030404' },
  { border: '#FF188C', shadow: '#FF9A00', bg: '#FF188C', text: '#030404' },
  { border: '#030404', shadow: '#FF9A00', bg: '#FF9A00', text: '#F5F1E5' },
  { border: '#FF9A00', shadow: '#FF188C', bg: '#FF188C', text: '#030404' },
  { border: '#FF188C', shadow: '#030404', bg: '#FF9A00', text: '#F5F1E5' },
  { border: '#030404', shadow: '#FF188C', bg: '#FF188C', text: '#F5F1E5' },
  { border: '#FF9A00', shadow: '#030404', bg: '#FF9A00', text: '#030404' }
];

const SPEAKERS_DATA = [
  {
    name: 'Mrs. Anjali Suneja',
    role: 'POSH Trainer & HR Leader',
    time: "Aarambh '26 · JKLU",
    image: '/images/speakers/Anjali_Suneja.webp',
    bio: "Meet Anjali Suneja, a veteran Human Resources strategist and a Ministry-empanelled POSH & POCSO Consultant. Over her distinguished 15-year career, she has dedicated herself to fostering safe, respectful, and compliant environments in both corporate offices and academic institutions. ",
    expertise: ['POSH Training', 'HR Leadership', 'Inclusion'],
    linkedin: 'https://www.linkedin.com/in/anjali-suneja-05021427/',
  },
  {
    name: 'Mr. Kunal Agarwal',
    role: 'Designer & Craftsman',
    time: "Aarambh '26 · JKLU",
    image: '/images/speakers/Kunal Agarwal .webp',
    bio: "Kunal Agarwal is a creative designer and craftsman who believes that art is best experienced hands-on. By blending traditional craftsmanship with contemporary design thinking, he transforms simple materials into meaningful stories. His work reflects patience, creativity, and cultural connection. At Aarambh ’26, Kunal invites students to explore the joy of creating something with their own hands while rediscovering the beauty of slow and mindful art.",
    expertise: ['Design', 'Craft', 'Tradition'],
    linkedin: 'https://www.linkedin.com/in/kunalagarwal112/',
  },
  {
    name: 'Mr. Manish Freeman',
    role: 'Movement Falicitator',
    time: "Aarambh '26 · JKLU",
    image: '/images/speakers/Manish Freeman .webp',
    bio: "Manish Freeman is an experiential learning facilitator, community builder, and corporate wellness expert. Rejecting a conventional engineering path, he dedicated his career to human connection, play-based leadership development, and championing a unique 'Gift Culture' lifestyle. His training programs are trusted by top-tier organizations like she’ll energy, Deloitte, the Indian Army, Tata Trusts, and the National Academy of Customs (NACIN).His workshop in aarambh will help freshers to get along and create amazing memories. ",
    expertise: ['Movement', 'Dance', 'Connection'],
    linkedin: 'https://www.linkedin.com/in/manish-freeman-a7ab34169/',
  },
  {
    name: 'Mr. Mukesh Choudhary',
    role: 'Cyber Crime Consultant',
    time: "Aarambh '26 · JKLU",
    image: '/images/speakers/Mukesh Choudhary.webp',
    bio: "Mukesh Choudhary is a Cyber Crime Consultant and InfoSec professional with extensive experience in digital security and cyber awareness. Having worked closely with leading law enforcement and intelligence agencies, he brings deep insights into the evolving world of cybersecurity. Through his practical knowledge and engaging sessions, he inspires students to stay informed, aware, and prepared for the challenges of the digital era.",
    expertise: ['Cyber Security', 'InfoSec', 'Law Enforcement'],
    linkedin: 'https://www.google.com/search?q=https://www.linkedin.com/in/mukesh-choudhary-cyber-expert',
  },
  {
    name: 'Mr. RamG Vallath',
    role: 'Growth Mindset & Resilience Coach | TedX Speaker',
    time: "Aarambh '26 · JKLU",
    image: '/images/speakers/RamG Vallath.webp',
    bio: "RamG Vallath is a bestselling author, highly sought-after motivational speaker, and former tech industry leader. After a successful corporate career at companies like HP and Dell, he faced a life-altering diagnosis of a rare autoimmune disorder. Drawing from his personal journey of reinvention, he now empowers students and professionals alike, focusing on the power of resilience, developing a growth mindset, and bouncing back from life's toughest challenges with humor and positivity.",
    expertise: ['Resilience', 'Growth Mindset', 'Leadership'],
    linkedin: 'https://www.linkedin.com/in/ramgvallath/',
  },
  {
    name: 'Mrs. Vibhuti Mehra',
    role: 'Professional Makeup Artist',
    time: "Aarambh '26 · JKLU",
    image: '/images/speakers/Vibhuti Mehra.webp',
    bio: "Vibhuti Mehra is a Professional Makeup Artist based in Jaipur, Rajasthan, and the founder of her own full-time beauty venture, Vibhuti Mehra Makeup. Coming from an educational background at Government Women Engineering College Ajmer, she successfully pivoted to pursue her passion in the beauty industry, bringing a unique blend of technical precision and creative vision to her craft.",
    expertise: ['Makeup Artistry', 'Beauty & Cosmetics', 'Creative Styling'],
    linkedin: 'https://www.linkedin.com/in/vibhuti-mehra/',
  },
  {
    name: 'Manan Pahwa',
    role: 'Design & Behavior Researcher',
    time: "Aarambh '26 · JKLU",
    image: '/images/speakers/Manan Pahwa .webp',
    bio: "Manan is an applied behavior strategist and researcher who operates at the fascinating intersection of human psychology and system design. At Aarambh '26, he will be delivering a powerful session on decoding human decisions. He will take the audience on a deep dive to uncover the 'why' behind our actions—permanently shifting how we perceive consumer choices and system building.",
    expertise: ['Behavioral Research', 'Design Thinking', 'Decision Making'],
    linkedin: 'https://www.linkedin.com/in/mananpahwaa/',
  },
];

const SCROLL_SPEED_FACTOR = 0.25;

const textVariants = {
  initial: (dir: number) => ({ opacity: 0, y: dir * 30 }),
  animate: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir * -30 })
};

const cardVariants = {
  initial: (dir: number) => ({ opacity: 0, x: dir * 60, scale: 0.97 }),
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60, scale: 0.97 })
};

export default function SpeakersSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndexRef = useRef(0);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = forward, -1 = backward
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const rafRef = useRef<number | null>(null);
  const containerOffsetRef = useRef(0);

  const handleSpeakerClick = (idx: number) => {
    if (idx !== currentIndex) {
      setDirection(idx > currentIndex ? 1 : -1);
      prevIndexRef.current = idx;
      setCurrentIndex(idx);
      playSynthSound('click');
    }
    if (isLargeScreen) {
      window.scrollTo({
        top: idx * window.innerHeight * SCROLL_SPEED_FACTOR,
        behavior: 'smooth'
      });
    }
  };

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Check if swipe is mostly horizontal and significant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        // Swiped left -> Next speaker
        const nextIdx = Math.min(SPEAKERS_DATA.length - 1, currentIndex + 1);
        window.scrollTo({
          top: nextIdx * window.innerHeight * SCROLL_SPEED_FACTOR,
          behavior: 'smooth'
        });
      } else {
        // Swiped right -> Previous speaker
        const prevIdx = Math.max(0, currentIndex - 1);
        window.scrollTo({
          top: prevIdx * window.innerHeight * SCROLL_SPEED_FACTOR,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    // Set initial size on client
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic scaling based on viewport height
  const viewportHeight = dimensions.height;
  const isLargeScreen = dimensions.width >= 1024; // lg breakpoint

  // Base parameters for desktop
  const estimatedColWidth = isLargeScreen ? Math.floor((dimensions.width - 96) * 0.35) : 0;
  const R = isLargeScreen
    ? Math.min(Math.floor((estimatedColWidth - 8) / 1.42), Math.min(360, Math.max(180, (viewportHeight / 2 - 60) / 1.2)))
    : 290;
  const cardHeight = isLargeScreen ? R * 0.36 : 80;
  const cardWidth = isLargeScreen ? cardHeight : 70;
  const angleStep = 25; // degrees — 7 speakers span ±75°, no overlap
  const dialOffset = isLargeScreen ? Math.round(cardWidth / 2 + 10) : 0; // push center right so top/bottom cards clear the column edge

  // Cache container's document offset once (avoids getBoundingClientRect in hot path)
  useEffect(() => {
    const updateOffset = () => {
      if (!containerRef.current) return;
      let el: HTMLElement | null = containerRef.current;
      let offset = 0;
      while (el) {
        offset += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      containerOffsetRef.current = offset;
    };
    updateOffset();
    window.addEventListener('resize', updateOffset, { passive: true });
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  // RAF-throttled scroll handler — fires at most once per animation frame
  useEffect(() => {
    const onScroll = () => {
      if (!isLargeScreen) return;
      if (rafRef.current !== null) return; // already a frame pending
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const interval = vh * SCROLL_SPEED_FACTOR;
        const scrollDepth = scrollY - containerOffsetRef.current;

        if (scrollDepth >= 0) {
          let newIndex = Math.floor(scrollDepth / interval);
          newIndex = Math.max(0, Math.min(newIndex, SPEAKERS_DATA.length - 1));
          if (newIndex !== prevIndexRef.current) {
            setDirection(newIndex > prevIndexRef.current ? 1 : -1);
            prevIndexRef.current = newIndex;
            setCurrentIndex(newIndex);
            playSynthSound('click');
          }
        } else {
          if (prevIndexRef.current !== 0) {
            setDirection(-1);
            prevIndexRef.current = 0;
            setCurrentIndex(0);
            playSynthSound('click');
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount to set initial state

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isLargeScreen]);

  const speaker = SPEAKERS_DATA[currentIndex];
  const theme = THEMES[currentIndex % THEMES.length];

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-auto lg:h-auto"
      style={isLargeScreen ? { height: `${((SPEAKERS_DATA.length - 1) * SCROLL_SPEED_FACTOR * 100) + 100}vh` } : undefined} 
    >
      <div
        className="relative lg:sticky lg:top-0 w-full h-[100dvh] bg-[#F5F1E5] overflow-hidden font-sans selection:bg-[#FF188C] selection:text-[#F5F1E5]"
        style={{ backgroundImage: 'radial-gradient(rgba(13, 33, 221, 0.07) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
      >
        {/* Soft Fluid Aura Blobs (Zero Black) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-[0.08]"
            style={{ background: '#FF188C', filter: 'blur(120px)' }}
            animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[5%] w-[50%] h-[50%] rounded-full opacity-[0.08]"
            style={{ background: '#0D21DD', filter: 'blur(120px)' }}
            animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full opacity-[0.05]" style={{ background: '#FF9A00', filter: 'blur(100px)' }} />
        </div>

        {/* Radiating pop-art pink rays from the left edge center */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-screen pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, idx) => {
            const angle = -70 + idx * 10;
            return (
              <div
                key={idx}
                className="absolute left-0 top-1/2 h-[1px] bg-brand-pink/20 origin-left"
                style={{
                  width: '120vw',
                  transform: `translateY(-50%) rotate(${angle}deg)`,
                }}
              />
            );
          })}
        </div>

        {/* Scroll Progress indicators at top */}
        <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 md:gap-2">
          {SPEAKERS_DATA.map((_, i) => (
            <div
              key={i}
              className="transition-all duration-300 border-[2px] border-[#030404]"
              style={{
                width: i === currentIndex ? 24 : 8,
                height: 8,
                backgroundColor: i === currentIndex ? THEMES[i % THEMES.length].primary : '#F5F1E5',
                opacity: i === currentIndex ? 1 : 0.4,
              }}
            />
          ))}
        </div>

        {/* DESKTOP VIEWPORT LAYOUT */}
        <div className="hidden lg:flex w-full h-full relative z-10 px-12 items-center justify-between pt-20 pb-10">
          
          {/* 1. LEFT COLUMN: FIXED-ARC SPEAKER RING */}
          <div className="w-[35%] h-full relative flex items-center justify-start overflow-hidden">

            {/* Decorative ring — rotates for visual effect only, no speaker children */}
            <div
              className="absolute rounded-full border-[8px] border-[#030404] bg-[#F5F1E5]/40 backdrop-blur-sm shadow-[8px_8px_0px_#FF188C]"
              style={{
                width: `${2 * R}px`,
                height: `${2 * R}px`,
                left: `${dialOffset}px`,
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${currentIndex * angleStep * 1.5}deg)`,
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform'
              }}
            >
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-[#030404]/10" />
              <div className="absolute inset-20 rounded-full border border-[#030404]/5" />
            </div>

            {/* All 7 speakers at FIXED arc positions — all always visible, none rotate */}
            {SPEAKERS_DATA.map((sp, idx) => {
              const isActive = idx === currentIndex;
              const spColor = CARD_COLORS[idx % CARD_COLORS.length];
              const angleRad = ((idx - (SPEAKERS_DATA.length - 1) / 2) * angleStep) * Math.PI / 180;
              const cx = dialOffset + R * Math.cos(angleRad);
              const cy = R * Math.sin(angleRad);
              return (
                <motion.div
                  key={idx}
                  className="absolute rounded-full border-[4px] overflow-hidden cursor-pointer"
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardWidth}px`,
                    left: `${cx}px`,
                    top: '50%',
                    transform: `translate(-50%, calc(-50% + ${cy}px)) scale(${isActive ? 1.2 : 1})`,
                    borderColor: isActive ? '#FF188C' : spColor.border,
                    boxShadow: isActive
                      ? `0 0 0 3px #FF188C, 4px 4px 0px ${spColor.shadow}`
                      : `2px 2px 0px ${spColor.shadow}`,
                    transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease',
                    willChange: 'transform',
                    zIndex: isActive ? 10 : 5,
                  }}

                  onClick={() => handleSpeakerClick(idx)}
                >
                  <img src={sp.image} alt={sp.name} className="w-full h-full object-cover" />
                  {!isActive && <div className="absolute inset-0 rounded-full bg-[#030404]/20" />}
                </motion.div>
              );
            })}

          </div>

          {/* 2. MIDDLE COLUMN: TEXT CONTENT */}
          <div className="w-[34%] h-full flex flex-col justify-center items-start pl-12 z-20 pointer-events-none select-none overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={speaker.name}
                custom={direction}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-start"
              >
                <div
                  className="inline-block px-4 py-1.5 border-[3px] border-[#030404] text-xs uppercase tracking-widest font-black mb-6 shadow-[4px_4px_0px_#030404]"
                  style={{ backgroundColor: theme.primary, color: '#F5F1E5' }}
                >
                  {speaker.role}
                </div>
                <h2
                  className="text-5xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-[#030404] mb-2 leading-none"
                >
                  {speaker.name.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h2>
                
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3. RIGHT COLUMN: DOSSIER CARD */}
          <div className="w-[31%] h-full flex items-center justify-center relative z-20">
            <AnimatePresence mode="wait" custom={direction}>
              <DossierCard key={speaker.name} speaker={speaker} theme={theme} direction={direction} currentIndex={currentIndex} />
            </AnimatePresence>
          </div>

        </div>


        {/* MOBILE VIEWPORT LAYOUT */}
        <div
          className="lg:hidden w-full h-full flex flex-col relative z-10"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 1. HEADER: role badge + name + event label */}
          <div className="shrink-0 w-full text-center z-20 select-none pt-28 px-4 mt-safe">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={speaker.name + '-header'}
                custom={direction}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center"
              >
                <div
                  className="inline-block px-3 py-1 border-[2px] border-[#030404] text-[10px] uppercase tracking-widest font-black mb-2 shadow-[2px_2px_0px_#030404]"
                  style={{ backgroundColor: theme.primary, color: '#F5F1E5' }}
                >
                  {speaker.role}
                </div>
                <h2
                  className="text-3xl font-black uppercase tracking-tighter text-[#030404] leading-none mb-1"
                >
                  {speaker.name}
                </h2>
                <p className="text-brand-pink font-bold text-[9px] uppercase tracking-widest">
                  {speaker.time}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 2. SPEAKER CARD — explicit width so w-full inside DossierCard works */}
          <div className="flex-1 flex items-center justify-center z-20 px-6 pb-[155px] relative">
            {/* Left navigation arrow for mobile */}
            <button
              onClick={() => handleSpeakerClick(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="absolute left-2 xs:left-4 sm:left-12 top-1/2 -translate-y-1/2 -mt-16 w-11 h-11 rounded-full border-[3px] border-[#030404] bg-[#F5F1E5] flex items-center justify-center shadow-[3px_3px_0px_#030404] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#030404] transition-all disabled:opacity-20 disabled:pointer-events-none z-30 cursor-pointer"
              aria-label="Previous speaker"
            >
              <ChevronLeft size={22} className="text-[#030404]" strokeWidth={3} />
            </button>

            <AnimatePresence mode="wait" custom={direction}>
              {/* Fixed width container — this is the key fix */}
              <motion.div
                key={speaker.name + '-card-wrapper'}
                custom={direction}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="w-[200px] xs:w-[220px] sm:w-[260px]"
              >
                <DossierCard speaker={speaker} theme={theme} direction={direction} currentIndex={currentIndex} />
              </motion.div>
            </AnimatePresence>

            {/* Right navigation arrow for mobile */}
            <button
              onClick={() => handleSpeakerClick(Math.min(SPEAKERS_DATA.length - 1, currentIndex + 1))}
              disabled={currentIndex === SPEAKERS_DATA.length - 1}
              className="absolute right-2 xs:right-4 sm:right-12 top-1/2 -translate-y-1/2 -mt-16 w-11 h-11 rounded-full border-[3px] border-[#030404] bg-[#F5F1E5] flex items-center justify-center shadow-[3px_3px_0px_#030404] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#030404] transition-all disabled:opacity-20 disabled:pointer-events-none z-30 cursor-pointer"
              aria-label="Next speaker"
            >
              <ChevronRight size={22} className="text-[#030404]" strokeWidth={3} />
            </button>
          </div>

          {/* 3. BOTTOM ARC DIAL — absolutely pinned to bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[150px] overflow-hidden select-none z-30">

            {/* Decorative ring — rotates for visual effect only, no speaker children */}
            <div
              className="absolute rounded-full border-[4px] border-[#030404] bg-[#F5F1E5]/40"
              style={{
                width: '560px',
                height: '560px',
                bottom: '-490px',
                left: '50%',
                transform: `translateX(-50%) rotate(${currentIndex * 20}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform'
              }}
            >
              <div className="absolute inset-4 rounded-full border border-dashed border-[#030404]/10" />
            </div>

            {/* All 7 speakers at FIXED arc positions — all always visible, none rotate */}
            {SPEAKERS_DATA.map((sp, idx) => {
              const isActive = idx === currentIndex;
              const spColor = CARD_COLORS[idx % CARD_COLORS.length];
              const mobileR = 280;
              const ringCenterY = 360; // px from container top
              const totalArcDeg = 70; // ±35° keeps outer cards on-screen at 375px width
              const mobileAngleStep = totalArcDeg / (SPEAKERS_DATA.length - 1);
              const mobileCardSize = isActive ? 58 : 50;
              const angleRad = ((idx - (SPEAKERS_DATA.length - 1) / 2) * mobileAngleStep) * Math.PI / 180;
              const cxOffset = mobileR * Math.sin(angleRad);
              const cy = ringCenterY - mobileR * Math.cos(angleRad);
              return (
                <div
                  key={idx}
                  className="absolute rounded-full border-[3px] overflow-hidden cursor-pointer"
                  style={{
                    width: `${mobileCardSize}px`,
                    height: `${mobileCardSize}px`,
                    left: `calc(50% + ${cxOffset}px)`,
                    top: `${cy}px`,
                    transform: 'translate(-50%, -50%)',
                    borderColor: isActive ? '#FF188C' : spColor.border,
                    boxShadow: isActive
                      ? `0 0 0 2px #FF188C, 3px 3px 0px ${spColor.shadow}`
                      : `1px 1px 0px ${spColor.shadow}`,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: isActive ? 10 : 5,
                  }}
                  onClick={() => handleSpeakerClick(idx)}
                >
                  <img src={sp.image} alt={sp.name} className="w-full h-full object-cover" />
                  {!isActive && <div className="absolute inset-0 rounded-full bg-[#030404]/20" />}
                </div>
              );
            })}

            {/* Swipe indicator strip */}
            <div className="absolute bottom-2 left-4 right-4 flex justify-between items-center text-[9px] font-black uppercase text-[#030404]/40 tracking-wider">
              <span className="flex items-center gap-1"><ArrowLeft size={10} /> Swipe</span>
              <span>{currentIndex + 1} / {SPEAKERS_DATA.length}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DOSSIER CARD COMPONENT (LIGHT THEME - NO BLACK TONES EXCEPT INTENTIONAL OUTLINES)
// ---------------------------------------------------------------------------
function DossierCard({ 
  speaker, 
  theme, 
  direction, 
  currentIndex
}: { 
  speaker: any; 
  theme: any; 
  direction: 1 | -1;
  currentIndex: number;
}) {
  const [showBio, setShowBio] = useState(false);

  // Cycle the bio reveal background color and text
  const bioBgClass = currentIndex % 3 === 0 
    ? 'bg-[#FF188C] text-[#F5F1E5]' 
    : currentIndex % 3 === 1 
      ? 'bg-[#FF9A00] text-[#030404]' 
      : 'bg-[#F5F1E5] text-[#030404]';

  const bioBorderClass = currentIndex % 3 === 0
    ? 'border-[#030404]'
    : currentIndex % 3 === 1
      ? 'border-[#030404]'
      : 'border-[#030404]';

  return (
    <motion.div
      custom={direction}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="relative w-full max-w-[260px] sm:max-w-[320px] md:max-w-[400px] aspect-[3/4] group z-20"
    >
      {/* FRONT PHOTO BASE */}
      <div className="absolute inset-0 w-full h-full shadow-[16px_16px_0px_#FF188C] md:shadow-[20px_20px_0px_#FF188C] border-[8px] md:border-[12px] border-[#030404] bg-[#030404] overflow-hidden">
        <img
          src={speaker.image}
          alt={speaker.name}
          className="w-full h-full object-cover transition-all duration-700 pointer-events-none"
        />

        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />

        <button
          onClick={() => setShowBio(true)}
          className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-20 h-20 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center shadow-[4px_4px_0px_#030404] md:shadow-[6px_6px_0px_#030404] border-[4px] border-[#030404] hover:scale-110 transition-all duration-300 z-30 cursor-pointer"
          style={{ backgroundColor: theme.highlight }}
        >
          <Plus size={24} className="text-[#030404] mb-0.5 md:mb-1 w-5 md:w-7 h-5 md:h-7" />
          <span className="text-[#030404] font-black uppercase text-[8px] md:text-[10px] tracking-widest leading-none">
            View<br />Bio
          </span>
        </button>
      </div>

      {/* BIO REVEAL (FLIP DETAILED SECTION) */}
      <motion.div
        initial={{ clipPath: 'circle(0% at 10% 90%)' }}
        animate={{ clipPath: showBio ? 'circle(150% at 10% 90%)' : 'circle(0% at 10% 90%)' }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className={`absolute inset-0 w-full h-full shadow-[16px_16px_0px_#FF188C] md:shadow-[20px_20px_0px_#FF188C] border-[8px] md:border-[12px] ${bioBgClass} ${bioBorderClass} overflow-hidden p-4 md:p-8 flex flex-col justify-between z-40 cursor-default`}
      >
        <div className="absolute inset-0 opacity-15 mix-blend-luminosity pointer-events-none">
          <img src={speaker.image} className="w-full h-full object-cover blur-[2px]" alt="watermark" />
          <div className="absolute inset-0 bg-[#030404]/30" />
        </div>

        <div className="relative z-10 flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex justify-between items-start mb-4 md:mb-6 border-b-[3px] border-current/25 pb-4 md:pb-6 shrink-0">
            <div className="flex flex-col items-start gap-2 md:gap-3">
              <button
                onClick={() => setShowBio(false)}
                className="flex items-center gap-1 md:gap-1.5 px-2 md:px-2.5 py-1 bg-[#F5F1E5] text-[#030404] text-[9px] md:text-[10px] font-black uppercase tracking-widest border-[2px] border-[#030404] shadow-[2px_2px_0px_#030404] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all cursor-pointer"
              >
                <ArrowLeft size={10} className="w-3 h-3 md:w-auto md:h-auto" /> Back
              </button>
              
              <div>
                <h3 className="font-black text-xl md:text-3xl uppercase tracking-tighter leading-none mb-1.5 md:mb-2">
                  {speaker.name}
                </h3>
                <p className="opacity-80 font-bold text-[9px] md:text-xs uppercase tracking-widest mb-2 md:mb-3">{speaker.time}</p>
                {speaker.linkedin && (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 border-[2px] border-current bg-current/10 hover:bg-current/20 transition-all duration-200 cursor-pointer group/li"
                    style={{ textDecoration: 'none' }}
                  >
                    <LinkedInIcon />
                    <span className="font-black text-[9px] md:text-[10px] uppercase tracking-widest">LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <p className="font-medium text-[11px] md:text-sm leading-relaxed mb-4 md:mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {speaker.bio}
          </p>

          <div className="mt-auto">
            <p className="opacity-60 text-[9px] md:text-xs font-black uppercase tracking-widest mb-2 md:mb-3">Core Focus</p>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {speaker.expertise.map((skill: string, i: number) => (
                <span key={i} className="px-1.5 md:px-2 py-0.5 md:py-1 bg-current/10 border border-current/30 text-current text-[8px] md:text-[10px] font-bold uppercase tracking-wider">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
