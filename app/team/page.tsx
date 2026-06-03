'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Crown, 
  GraduationCap, 
  Award, 
  Users, 
  ChevronDown 
} from 'lucide-react';
import { TEAM_DATA, TeamMember } from '@/constants/team';
import ChromaGrid, { ChromaItem } from '@/components/ui/ChromaGrid';
import Image from 'next/image';
import DoodleBg from '@/components/ui/DoodleBg';

interface SectionHeadingProps {
  label: string;
  sub?: string;
  accent?: string;
}

function SectionHeading({ label, sub, accent }: SectionHeadingProps) {
  return (
    <div className="text-center mb-10 relative z-10 flex flex-col items-center">
      {sub && (
        <span 
          className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] px-2.5 sm:px-3.5 py-1 sm:py-1.5 border-comic text-brand-cloud rotate-[-2deg] shadow-comic-sm mb-4"
          style={{ backgroundColor: accent || '#FF188C' }}
        >
          {sub}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-ink uppercase leading-none tracking-tight">
        {label}
      </h2>
    </div>
  );
}

export default function TeamPage() {
  // Helper to map member to chroma item
  const mapMemberToChromaItem = (member: TeamMember, type: 'vc' | 'osa' | 'orgHead' | 'tl'): ChromaItem => {
    let borderColor = '#F5F1E5'; // default brand.white/cloud
    let gradient = 'linear-gradient(145deg, rgba(245, 241, 229, 0.05), rgba(3, 4, 4, 0.95))';

    if (type === 'vc') {
      borderColor = '#FF9A00'; // brand.orange
      gradient = 'linear-gradient(145deg, rgba(255, 154, 0, 0.15), rgba(3, 4, 4, 0.98))';
    } else if (type === 'osa') {
      borderColor = '#FF9A00'; // Match VC brand.orange color scheme
      gradient = 'linear-gradient(145deg, rgba(255, 154, 0, 0.15), rgba(3, 4, 4, 0.98))';
    } else if (type === 'orgHead') {
      borderColor = '#FF188C'; // brand.pink
      gradient = 'linear-gradient(145deg, rgba(255, 24, 140, 0.15), rgba(3, 4, 4, 0.98))';
    } else if (type === 'tl') {
      const dept = member.department?.toLowerCase() || '';
      if (dept.includes('tech')) {
        borderColor = '#FF9A00'; // brand.orange
        gradient = 'linear-gradient(145deg, rgba(255, 154, 0, 0.1), rgba(3, 4, 4, 0.95))';
      } else if (dept.includes('sponsorship') || dept.includes('finance')) {
        borderColor = '#10B981'; // emerald green
        gradient = 'linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(3, 4, 4, 0.95))';
      } else if (dept.includes('media') || dept.includes('design')) {
        borderColor = '#FF188C'; // brand.pink
        gradient = 'linear-gradient(145deg, rgba(255, 24, 140, 0.1), rgba(3, 4, 4, 0.95))';
      } else if (dept.includes('hospitality')) {
        borderColor = '#8B5CF6'; // purple
        gradient = 'linear-gradient(145deg, rgba(139, 92, 246, 0.1), rgba(3, 4, 4, 0.95))';
      } else {
        borderColor = '#0D21DD'; // brand.blue
        gradient = 'linear-gradient(145deg, rgba(13, 33, 221, 0.1), rgba(3, 4, 4, 0.95))';
      }
    }

    return {
      image: member.photo || undefined,
      title: member.name,
      subtitle: type === 'tl' ? '' : member.designation,
      handle: member.socials?.linkedin ? '@' + member.name.toLowerCase().replace(/\s+/g, '') : undefined,
      location: member.department,
      borderColor,
      gradient,
      url: member.socials?.linkedin || (member.socials?.email ? `mailto:${member.socials.email}` : undefined),
      socials: member.socials
    };
  };

  const topRowItems = useMemo(() => [
    { ...mapMemberToChromaItem(TEAM_DATA.vc, 'vc'), socials: undefined },
    { ...mapMemberToChromaItem(TEAM_DATA.osa[0], 'osa'), socials: undefined } // Deepak Sogani
  ], []);

  const bottomRowItems = useMemo(() => TEAM_DATA.osa.slice(1).map(m => mapMemberToChromaItem(m, 'osa')), []); // Anushka, Vaibhav, Gajendra, Rajesh

  const orgHeadItems = useMemo(() => TEAM_DATA.organizingHeads.map(m => mapMemberToChromaItem(m, 'orgHead')), []);

  // Group team leaders into committees and cluster heads
  const groupedTeamLeaders = useMemo(() => {
    const groups: { heading: string; items: TeamMember[] }[] = [
      { heading: "Discipline", items: [] },
      { heading: "Technical", items: [] },
      { heading: "Design", items: [] },
      { heading: "Photography", items: [] },
      { heading: "Media", items: [] },
      { heading: "Social Media", items: [] },
      { heading: "Hospitality", items: [] },
      { heading: "Event & Venue", items: [] },
      { heading: "Food & Accommodation", items: [] },
      { heading: "Internal Arrangements", items: [] },
      { heading: "Feedback & Registration", items: [] },
      { heading: "Cluster Heads", items: [] },
    ];

    TEAM_DATA.teamLeaders.forEach(member => {
      const dept = member.department || "";
      const groupName = dept === "Cluster Head" ? "Cluster Heads" : dept;

      const targetGroup = groups.find(g => g.heading === groupName);
      if (targetGroup) {
        targetGroup.items.push(member);
      }
    });

    return groups.filter(g => g.items.length > 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Doodle Pattern */}
      <DoodleBg />

      {/* Decorative Background Glows */}
      <div className="hero-glow w-[500px] h-[500px] bg-brand-orange/10 -top-20 left-1/4 z-0" />
      <div className="hero-glow w-[400px] h-[400px] bg-brand-pink/10 top-1/3 -right-20 z-0" />
      <div className="hero-glow w-[600px] h-[600px] bg-brand-blue/10 bottom-0 -left-20 z-0" />

      <div className="py-28 px-4 md:px-6 max-w-7xl mx-auto relative z-10">

      {/* Header */}
      <header className="text-center mb-24 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="page-title mb-6 !text-brand-ink"
        >
          Our Team
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="page-subtitle mx-auto !text-brand-ink/75"
        >
          Meet the visionary leadership, dedicated mentors, and passionate student core working behind the scenes to make AARAMBH&apos;26 a grand success.
        </motion.p>
      </header>

      {/* Hierarchy Section */}
      <div className="space-y-32 relative z-10">
        
        {/* Consolidated Leadership and Mentorship Grid */}
        <section className="flex flex-col items-center w-full gap-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col items-center gap-12"
          >
            {/* Top Row: VC and Deepak Sogani */}
            <div className="w-full flex justify-center">
              <ChromaGrid items={topRowItems} radius={400} flipTrigger="none" />
            </div>

            {/* Bottom Row: Anushka, Vaibhav, Gajendra, Rajesh */}
            <div className="w-full flex justify-center">
              <ChromaGrid items={bottomRowItems} radius={400} flipTrigger="none" className="max-w-[1200px]" />
            </div>
          </motion.div>
        </section>

        {/* ── SECTION 2: ORGANIZING HEADS ─────────────────────────────────── */}
        <section className="mb-20 sm:mb-28">
          <SectionHeading label="Organizing Heads" accent="#FF188C" />
          <div className="w-full flex justify-center">
            <ChromaGrid items={orgHeadItems} radius={400} flipTrigger="none" className="max-w-[1200px]" />
          </div>
        </section>

        {/* Tier 4: Team Leaders */}
        <section className="flex flex-col items-center pt-8 border-t border-brand-ink/10 w-full">
          <div className="w-full text-center mb-16">
            <h2 className="text-3xl font-display font-black text-brand-ink flex items-center justify-center gap-2 uppercase tracking-wide">
              Team Leaders
            </h2>
            <p className="text-sm text-brand-ink/60 mt-2 font-mono uppercase tracking-wider">
              Coordinators of Aarambh &apos;26 by Committee
            </p>
          </div>

          {/* Grouped Committees */}
          <div className="w-full space-y-16">
            {groupedTeamLeaders.map((group) => {
              const mappedItems = group.items.map(m => mapMemberToChromaItem(m, 'tl'));
              return (
                <div key={group.heading} className="w-full relative">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="w-4.5 h-4.5 rounded-md border-2 border-brand-ink bg-brand-pink shrink-0 shadow-comic-sm" />
                    <h3 className="text-lg sm:text-xl font-display font-black uppercase text-brand-ink tracking-wide">
                      {group.heading}
                    </h3>
                    <div className="h-[2px] bg-brand-ink/10 flex-grow" />
                  </div>
                  <ChromaGrid items={mappedItems} radius={500} flipTrigger="none" />
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  </div>
  );
}
