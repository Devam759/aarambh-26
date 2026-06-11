'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Briefcase, Award } from 'lucide-react';

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

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
    role: 'Movement Facilitator',
    time: "Aarambh '26 · JKLU",
    image: '/images/speakers/Manish Freeman .webp',
    bio: "Manish Freeman is an experiential learning facilitator, community builder, and corporate wellness expert. Rejecting a conventional engineering path, he dedicated his career to human connection, play-based leadership development, and championing a unique 'Gift Culture' lifestyle. His training programs are trusted by top-tier organizations like Shell Energy, Deloitte, the Indian Army, Tata Trusts, and the National Academy of Customs (NACIN). His workshop in Aarambh will help freshers to get along and create amazing memories.",
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
    role: 'Growth Mindset & Resilience Coach | TEDx Speaker',
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

export default function SpeakersPage() {
  const [activeSpeaker, setActiveSpeaker] = useState<typeof SPEAKERS_DATA[0] | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeSpeaker) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeSpeaker]);

  return (
    <div className="min-h-screen bg-[#F5F1E5] text-brand-ink font-sans relative overflow-hidden">
      {/* Subtle Background Radial Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#215798]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#184176]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Header */}
        <header className="text-center mb-16 sm:mb-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-brand-ink mb-4">
            Speakers & <span className="text-brand-orange">Mentors</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-brand-ink/70 font-medium">
            Learn from industry leaders, distinguished mentors, and domain experts hosting interactive workshops and keynote sessions at Aarambh '26.
          </p>
        </header>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SPEAKERS_DATA.map((speaker, index) => {
            // Cycle card border colors dynamically based on brand guidelines
            const colors = ['border-brand-blue', 'border-brand-orange', 'border-[#184176]'];
            const borderColor = colors[index % colors.length];

            return (
              <motion.div
                key={speaker.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-brand-ink/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] w-full bg-[#030404]/5 overflow-hidden">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-orange mb-1.5 block">
                      {speaker.role}
                    </span>
                    <h3 className="text-lg font-display font-black text-brand-ink uppercase leading-tight line-clamp-1">
                      {speaker.name}
                    </h3>
                    <p className="text-xs text-brand-ink/60 mt-1 font-mono uppercase">
                      {speaker.time}
                    </p>
                  </div>
                </div>

                {/* Action button */}
                <div className="px-5 pb-5 pt-0">
                  <button
                    onClick={() => setActiveSpeaker(speaker)}
                    className="w-full py-2.5 px-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    View Bio
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bio Modal */}
      <AnimatePresence>
        {activeSpeaker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSpeaker(null)}
              className="absolute inset-0 bg-[#030404]/40 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-white border border-brand-ink/10 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] z-10"
            >
              {/* Close button */}
              <button
                onClick={() => setActiveSpeaker(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white border border-brand-ink/10 flex items-center justify-center text-brand-ink hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              {/* Portrait side */}
              <div className="w-full md:w-[240px] shrink-0 aspect-[4/3] md:aspect-auto relative bg-[#030404]/5">
                <img
                  src={activeSpeaker.image}
                  alt={activeSpeaker.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details side */}
              <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto grow">
                <div className="space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-orange/10 text-brand-orange text-[9px] font-black uppercase tracking-wider mb-2">
                      <Briefcase size={10} />
                      {activeSpeaker.role}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-ink uppercase leading-tight">
                      {activeSpeaker.name}
                    </h2>
                    <p className="text-xs text-brand-ink/50 mt-1 font-mono uppercase">
                      {activeSpeaker.time}
                    </p>
                  </div>

                  <p className="text-sm text-brand-ink/80 leading-relaxed font-medium">
                    {activeSpeaker.bio}
                  </p>

                  <div>
                    <h4 className="text-[10px] font-black uppercase text-brand-ink/50 tracking-wider mb-2">
                      Core Focus
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSpeaker.expertise.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded bg-[#F5F1E5] text-brand-ink text-[10px] font-bold uppercase tracking-wider border border-brand-ink/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {activeSpeaker.linkedin && (
                  <div className="mt-8 border-t border-brand-ink/10 pt-4 flex items-center">
                    <a
                      href={activeSpeaker.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#215798] hover:bg-[#184176] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <LinkedInIcon />
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
