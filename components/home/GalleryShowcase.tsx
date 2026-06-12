'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PHOTOS } from '@/constants/photos';

export default function GalleryShowcase() {
  const router = useRouter();
  const [galleryMounted, setGalleryMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isCTAloading, setIsCTALoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  useEffect(() => {
    setGalleryMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBeginExperience = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCTAloading) return;
    setIsCTALoading(true);
    setLoadingCount(0);

    try {
      const preloadImage = (src: string) => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => {
            setLoadingCount(prev => prev + 1);
            resolve();
          };
          img.onerror = () => {
            setLoadingCount(prev => prev + 1);
            resolve();
          };
        });
      };

      await Promise.all(PHOTOS.map(p => preloadImage(p.src)));
    } catch (err) {
      console.error("Failed to preload images:", err);
    }

    router.push('/gallery');
  };

  const col1Images = PHOTOS.slice(0, 8).map(p => p.src);
  const col2Images = PHOTOS.slice(8, 16).map(p => p.src);
  const col3Images = PHOTOS.slice(16, 24).map(p => p.src);
  const col4Images = PHOTOS.slice(24, 32).map(p => p.src);

  return (
    <section id="gallery-showcase" className="w-full relative z-10 bg-brand-cloud border-t-4 border-brand-ink text-brand-ink">
      <style dangerouslySetInnerHTML={{
        __html: `
          .gl-root {
            width: 100%;
            height: 980px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            background: #F5F1E5;
            perspective: 1200px;
          }

          /* ── ENTER MAGIC CARD ── */
          .gl-card {
            position: relative;
            z-index: 10;
            width: clamp(280px, 82vw, 390px);
            background: #F5F1E5;
            border: 3.5px solid #030404;
            border-radius: 20px;
            padding: 32px 28px;
            text-align: center;
            box-shadow: 12px 12px 0px 0px #030404;
            overflow: visible;
            transform-style: flat;
            will-change: transform;
          }

          /* sliding photo columns */
          .gl-slider-column {
            position: absolute;
            top: -10%;
            width: 145px;
            height: 120%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 22px;
            z-index: 2;
            pointer-events: none;
            opacity: 0.85;
          }

          .gl-slider-img-container {
            width: 100%;
            height: 195px;
            position: relative;
            border: 1px solid #030404;
            border-radius: 14px;
            overflow: hidden;
            background: #030404;
          }

          .gl-slider-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          @keyframes slideUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }

          @keyframes slideDown {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }

          .gl-slider-track-up {
            display: flex;
            flex-direction: column;
            gap: 22px;
            animation: slideUp 24s linear infinite;
            will-change: transform;
            transform: translateZ(0);
          }

          .gl-slider-track-down {
            display: flex;
            flex-direction: column;
            gap: 22px;
            animation: slideDown 24s linear infinite;
            will-change: transform;
            transform: translateZ(0);
          }

          @media (max-width: 1200px) {
            .gl-slider-column.inner {
              display: none !important;
            }
          }

          @media (max-width: 768px) {
            .gl-slider-column {
              display: flex !important;
              flex-direction: row !important;
              width: 250% !important;
              height: 120px !important;
              left: -75% !important;
              right: auto !important;
              top: auto !important;
              gap: 8px !important;
              opacity: 0.85 !important;
            }
            
            /* Position columns as horizontal rows */
            .gl-slider-column.left:not(.inner) {
              top: 8% !important;
            }
            .gl-slider-column.left.inner {
              display: none !important;
            }
            .gl-slider-column.right.inner {
              display: none !important;
            }
            .gl-slider-column.right:not(.inner) {
              bottom: 8% !important;
            }

            .gl-slider-img-container {
              width: 70px !important;
              height: 105px !important;
              flex-shrink: 0 !important;
            }

            .gl-slider-track-up {
              display: flex !important;
              flex-direction: row !important;
              gap: 12px !important;
              animation: slideLeft 24s linear infinite !important;
            }

            .gl-slider-track-down {
              display: flex !important;
              flex-direction: row !important;
              gap: 12px !important;
              animation: slideRight 24s linear infinite !important;
            }
          }

          @keyframes slideLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          @keyframes slideRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }

          /* Starburst badge */
          .gl-starburst {
            position: absolute;
            width: 72px;
            height: 72px;
            background: #FF9A00;
            border: 2px solid #030404;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: starSpin 10s linear infinite;
          }
          @keyframes starSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .gl-starburst-text {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-display);
            font-weight: 900;
            font-size: 10px;
            color: #030404;
            letter-spacing: 0.05em;
            text-align: center;
            line-height: 1.1;
            animation: starSpin 10s linear infinite reverse;
          }

          .gl-devanagari {
            font-family: 'Tiro Devanagari Hindi', serif;
            font-size: 1.1rem;
            color: #030404;
            margin-bottom: 6px;
            letter-spacing: 0.05em;
            font-weight: 700;
          }

          .gl-eyebrow {
            font-family: var(--font-display);
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #FF188C;
            margin-bottom: 18px;
          }

          .gl-heading {
            font-family: var(--font-display);
            font-size: clamp(2rem, 7vw, 3rem);
            font-weight: 900;
            color: #030404;
            line-height: 1.0;
            letter-spacing: -0.03em;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          
          .gl-heading-highlight {
            color: #F5F1E5;
            text-shadow: 
              2px 2px 0 #FF188C,
              -2px -2px 0 #FF188C,
              2px -2px 0 #FF188C,
              -2px 2px 0 #FF188C,
              4px 4px 0 #030404;
          }

          .gl-divider {
            width: 50px;
            height: 4px;
            background: #030404;
            border-radius: 99px;
            margin: 18px auto 18px;
          }

          .gl-sub {
            font-family: var(--font-display);
            font-size: 0.8rem;
            font-weight: 600;
            color: #030404;
            letter-spacing: 0.02em;
            line-height: 1.5;
            margin-bottom: 24px;
          }

          /* Begin Experience button */
          .gl-cta {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-display);
            font-size: 0.85rem;
            font-weight: 900;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #030404;
            background: #f5821e;
            border: 3.5px solid #030404;
            border-radius: 12px;
            padding: 14px 28px;
            text-decoration: none;
            cursor: pointer;
            box-shadow: 5px 5px 0px 0px #030404;
            transition: all 0.2s ease-in-out;
          }
          .gl-cta:hover {
            background: #184176;
            color: #F5F1E5;
          }
          .gl-cta:active {
            opacity: 0.85;
          }

          .gl-corner-tag {
            position: absolute;
            font-family: var(--font-display);
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #030404;
            pointer-events: none;
            z-index: 5;
          }

          .gl-card-topbar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 10px;
            background: #FF9A00;
            border-bottom: 3.5px solid #030404;
          }
        `
      }} />

      <div className="gl-root">
        {/* Column 1: Left Outer (Slides Up) */}
        <div className="gl-slider-column left" style={{ left: '1.5%' }}>
          <div className="gl-slider-track-up">
            {[...col1Images, ...col1Images].map((src, i) => (
              <div key={`col1-${i}`} className="gl-slider-img-container">
                <Image 
                  src={src} 
                  alt="Aarambh" 
                  fill 
                  sizes="(max-width: 768px) 80px, 150px"
                  className="gl-slider-image object-cover" 
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Left Inner (Slides Down) */}
        {!isMobile && (
          <div className="gl-slider-column left inner" style={{ left: '12.5%' }}>
            <div className="gl-slider-track-down">
              {[...col2Images, ...col2Images].map((src, i) => (
                <div key={`col2-${i}`} className="gl-slider-img-container">
                  <Image 
                    src={src} 
                    alt="Aarambh" 
                    fill 
                    sizes="150px"
                    className="gl-slider-image object-cover" 
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Column 3: Right Inner (Slides Up) */}
        {!isMobile && (
          <div className="gl-slider-column right inner" style={{ right: '12.5%' }}>
            <div className="gl-slider-track-up">
              {[...col3Images, ...col3Images].map((src, i) => (
                <div key={`col3-${i}`} className="gl-slider-img-container">
                  <Image 
                    src={src} 
                    alt="Aarambh" 
                    fill 
                    sizes="150px"
                    className="gl-slider-image object-cover" 
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Column 4: Right Outer (Slides Down) */}
        <div className="gl-slider-column right" style={{ right: '1.5%' }}>
          <div className="gl-slider-track-down">
            {[...col4Images, ...col4Images].map((src, i) => (
              <div key={`col4-${i}`} className="gl-slider-img-container">
                <Image 
                  src={src} 
                  alt="Aarambh" 
                  fill 
                  sizes="(max-width: 768px) 80px, 150px"
                  className="gl-slider-image object-cover" 
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, padding: '0 20px', textAlign: 'center' }}>
          {/* Title Section */}
          {galleryMounted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: '650px',
                marginBottom: '32px'
              }}
            >
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: 'clamp(2.0rem, 5vw, 3rem)',
                fontWeight: 800,
                color: '#FF9A00',
                marginBottom: '16px',
                textShadow: '2px 2px 0px #030404',
                letterSpacing: '-0.02em'
              }}>
                Memories of 2025
              </h2>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                fontWeight: 600,
                color: '#030404',
                lineHeight: 1.6
              }}>
                Experience the best moments of Aarambh 2025 with our curated memories.
              </p>
            </motion.div>
          )}

          {/* Main Neo-Brutalism Card */}
          {galleryMounted && (
            <motion.div
              className="gl-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Content Container */}
              <div style={{ position: 'relative', zIndex: 10 }}>
                {/* Devanagari */}
                <div className="gl-devanagari">आरम्भ '२६</div>

                {/* Main heading */}
                <h1 className="gl-heading" style={{ marginBottom: '32px' }}>
                  ENTER THE <br />
                  <span className="gl-heading-highlight">GALLERY</span>
                </h1>

                {/* CTA - Navigates to /gallery */}
                <div style={{ display: 'inline-block', position: 'relative', zIndex: 100, marginTop: '8px' }}>
                  <button
                    onClick={handleBeginExperience}
                    className="gl-cta"
                    disabled={isCTAloading}
                    style={{ minWidth: '240px', pointerEvents: isCTAloading ? 'none' : 'auto' }}
                  >
                    {isCTAloading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        just a sec..
                      </span>
                    ) : (
                      "Begin Experience →"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
