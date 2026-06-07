'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState(pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setHoveredPath(pathname);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === '/') {
      if (href.startsWith('/#')) {
        e.preventDefault();
        const targetId = href.replace('/#', '');
        const element = document.getElementById(targetId);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else if (href === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Speakers', href: '/speakers' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' },
    { name: 'Register', href: '/register' },
  ];

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] lg:max-w-5xl z-50 transition-[padding,background-color,border-color,box-shadow] ease-out duration-300 rounded-full border ${
          isScrolled
            ? 'bg-brand-ink/80 backdrop-blur-xl border-brand-pink/30 py-2.5 px-6 shadow-[0_8px_32px_rgba(255,24,140,0.15)] shadow-brand-pink/10'
            : 'bg-brand-ink/40 backdrop-blur-md border-brand-cloud/10 py-3.5 px-6 shadow-lg'
        }`}
      >
        <div className="flex justify-between items-center w-full gap-4 lg:gap-6 xl:gap-8">
          {/* Logo Container */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <a
              href="https://jklu.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:scale-105 transition-transform"
            >
              <Image
                src="/jklu_logo_light.svg"
                alt="JKLU Logo"
                width={32}
                height={32}
                className="h-7 w-auto object-contain md:h-9"
                style={{ width: 'auto' }}
              />
            </a>
            <div className="w-[1.5px] h-5 md:h-6 bg-brand-cloud/25 self-center shrink-0" />
            <Link
              href="/"
              className="flex items-center hover:scale-105 transition-transform"
            >
              <Image
                src="/logo.svg"
                alt="AARAMBH'26"
                width={100}
                height={24}
                className="h-6 md:h-8 w-auto object-contain"
                style={{ width: 'auto' }}
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div 
            className="hidden lg:flex items-center gap-4 xl:gap-6"
            onMouseLeave={() => setHoveredPath(pathname)}
          >
            {/* Links */}
            <div className="flex items-center gap-1 xl:gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isHovered = hoveredPath === link.href;
                const isRegister = link.href === '/register';

                const textColor = isRegister 
                  ? (isHovered ? 'text-brand-cloud' : 'text-brand-ink')
                  : (isHovered ? 'text-brand-cloud' : (isActive ? 'text-brand-pink' : 'text-brand-cloud/70 hover:text-brand-cloud'));

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    onMouseEnter={() => setHoveredPath(link.href)}
                    className={`relative py-1.5 px-2.5 xl:px-4 text-[11px] xl:text-xs font-bold tracking-wide xl:tracking-widest uppercase transition-colors duration-200 rounded-full z-10 flex items-center justify-center ${textColor}`}
                  >
                    {isHovered && (
                      <motion.div
                        layoutId="navHoverPill"
                        className={`absolute inset-0 rounded-full -z-10 ${
                          isRegister 
                            ? 'bg-brand-blue shadow-[0_4px_16px_rgba(13,33,221,0.5)]' 
                            : isActive
                              ? 'bg-brand-pink shadow-[0_4px_16px_rgba(255,24,140,0.5)]'
                              : 'bg-brand-pink/75 backdrop-blur-md shadow-[0_4px_16px_rgba(255,24,140,0.4)]'
                        }`}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Register button static fallback CTA background */}
                    {isRegister && (
                       <div className="absolute inset-0 rounded-full bg-brand-orange shadow-[0_4px_16px_rgba(255,154,0,0.5)] -z-20" />
                    )}

                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden border-2 border-brand-ink p-1.5 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_#030404] rounded-md bg-brand-orange text-brand-ink"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`lg:hidden absolute top-[calc(100%+0.75rem)] left-0 w-full bg-brand-cloud border-4 border-brand-ink p-6 flex flex-col gap-3 shadow-[8px_8px_0px_0px_#030404] rounded-xl z-50 text-brand-ink origin-top transition-all duration-150 ease-out ${
            isMobileMenuOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-display font-black tracking-wider uppercase transition-all py-2.5 px-3 border-2 border-transparent hover:border-brand-ink hover:bg-brand-orange hover:-translate-y-0.5 rounded-lg flex items-center justify-between group ${
                pathname === link.href
                  ? 'text-brand-pink border-brand-ink bg-brand-pink/5'
                  : 'text-brand-ink hover:text-brand-ink'
              }`}
            >
              <span>{link.name}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-ink font-mono text-xs">→</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
