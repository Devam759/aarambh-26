'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ThemeBackground from '@/components/layout/ThemeBackground';
import { PHOTOS } from '@/constants/photos';

const WALL_POSITIONS = [
  { left: '10%',  top: '-10%' },
  { left: '36%',  top: '-10%' },
  { left: '62%',  top: '-10%' },
  { left: '90%',  top: '-10%' },
  { left: '110%', top: '15%'  },
  { left: '110%', top: '40%'  },
  { left: '110%', top: '65%'  },
  { left: '110%', top: '90%'  },
  { left: '90%',  top: '110%' },
  { left: '62%',  top: '110%' },
  { left: '36%',  top: '110%' },
  { left: '10%',  top: '110%' },
  { left: '-10%', top: '90%'  },
  { left: '-10%', top: '65%'  },
  { left: '-10%', top: '40%'  },
  { left: '-10%', top: '15%'  },
];

const CARD_COUNT = 64;
const BASE_Z_STEP = 90;
const BASE_Z_FAR = -5760;

export default function TunnelGallery() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [lightboxId, setLightboxId] = useState<number | null>(null);

  const tunnelRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const zOffsetRef = useRef(0);
  const targetZOffsetRef = useRef(0);
  const recycleCounterRef = useRef(CARD_COUNT % PHOTOS.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tunnel setup & animation loop
  useEffect(() => {
    if (!mounted || !tunnelRef.current) return;

    const zStep = BASE_Z_STEP;
    const zFar = BASE_Z_FAR;
    recycleCounterRef.current = CARD_COUNT % PHOTOS.length;

    const scene = tunnelRef.current;
    scene.innerHTML = '';

    for (let i = 0; i < CARD_COUNT; i++) {
      const wallIdx = i % WALL_POSITIONS.length;
      const baseZ = zFar + (i * zStep);
      const photoIdx = i % PHOTOS.length;
      const photo = PHOTOS[photoIdx];

      const card = document.createElement('div');
      card.className = 'tunnel-card';
      card.dataset.hoverScale = "1";
      card.dataset.baseZ = String(baseZ);
      card.dataset.wallIdx = String(wallIdx);
      card.dataset.photoIdx = String(photoIdx);
      card.dataset.photoId = String(photo.id);
      card.dataset.photoSrc = photo.src;

      card.onmouseenter = () => {
        card.dataset.hoverScale = "1.08";
      };
      card.onmouseleave = () => {
        card.dataset.hoverScale = "1";
      };

      card.style.left = '50%';
      card.style.top = '50%';

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.label;
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;border-radius:10px;';
      img.onerror = () => {
        card.style.background = '#030404';
      };

      card.appendChild(img);

      card.addEventListener('click', () => {
        const photoId = parseInt(card.dataset.photoId || '0', 10);
        const found = PHOTOS.find(p => p.id === photoId);
        if (found) {
          setLightboxId(found.id);
        }
      });

      scene.appendChild(card);
    }

    const tick = () => {
      try {
        const diff = targetZOffsetRef.current - zOffsetRef.current;
        zOffsetRef.current += diff * 0.15;

        if (Math.abs(zOffsetRef.current) > 60) {
          setShowScrollHint(false);
        }

        const cards = scene.querySelectorAll<HTMLElement>('.tunnel-card');
        if (!cards || cards.length === 0) {
          animRef.current = requestAnimationFrame(tick);
          return;
        }

        cards.forEach((card) => {
          const rawBaseZ = card.dataset.baseZ;
          const baseZ = rawBaseZ ? parseFloat(rawBaseZ) : 0;
          let z = baseZ + zOffsetRef.current;

          if (z > 300) {
            // Card flew past viewer — recycle to back
            const newBaseZ = baseZ - (CARD_COUNT * zStep);
            card.dataset.baseZ = String(newBaseZ);
            z = newBaseZ + zOffsetRef.current;

            const oldWallPos = parseInt(card.dataset.wallIdx || '0');
            const newWallPos = (oldWallPos + 3) % WALL_POSITIONS.length;
            card.dataset.wallIdx = String(newWallPos);

            const nextIdx = recycleCounterRef.current % PHOTOS.length;
            recycleCounterRef.current = (recycleCounterRef.current + 1) % PHOTOS.length;
            const nextPhoto = PHOTOS[nextIdx];
            const img = card.querySelector('img');
            if (img && nextPhoto) {
              img.setAttribute('src', nextPhoto.src);
              card.dataset.photoId = String(nextPhoto.id);
              card.dataset.photoSrc = nextPhoto.src;
            }
          } else if (z < zFar - 100) {
            // Card scrolled backward past end — recycle to front
            const newBaseZ = baseZ + (CARD_COUNT * zStep);
            card.dataset.baseZ = String(newBaseZ);
            z = newBaseZ + zOffsetRef.current;

            const oldWallPos = parseInt(card.dataset.wallIdx || '0');
            const newWallPos = (oldWallPos - 3 + WALL_POSITIONS.length) % WALL_POSITIONS.length;
            card.dataset.wallIdx = String(newWallPos);

            const nextIdx = ((recycleCounterRef.current - 1) + PHOTOS.length) % PHOTOS.length;
            recycleCounterRef.current = nextIdx;
            const nextPhoto = PHOTOS[nextIdx];
            const img = card.querySelector('img');
            if (img && nextPhoto) {
              img.setAttribute('src', nextPhoto.src);
              card.dataset.photoId = String(nextPhoto.id);
              card.dataset.photoSrc = nextPhoto.src;
            }
          }

          const wallPos = WALL_POSITIONS[parseInt(card.dataset.wallIdx || '0')];
          const depthFactor = Math.max(0, Math.min(1, (z + 3600) / 3600));
          const easeInCubic = Math.pow(depthFactor, 3);

          const startLeft = parseFloat(wallPos.left);
          const startTop = parseFloat(wallPos.top);

          const currentLeft = startLeft + (50 - startLeft) * easeInCubic;
          const currentTop = startTop + (55 - startTop) * easeInCubic;

          card.style.left = `${currentLeft}%`;
          card.style.top = `${currentTop}%`;

          const scale = 1400 / (1400 - z);
          
          let curHS = parseFloat(card.dataset.currentHoverScale || "1");
          const targetHS = parseFloat(card.dataset.hoverScale || "1");
          curHS += (targetHS - curHS) * 0.18;
          card.dataset.currentHoverScale = String(curHS);

          // Boost scale only for cards in focal zone
          const isMobileViewport = window.innerWidth <= 768;
          const maxFocusScale = isMobileViewport ? 1.2 : 1.6;
          const focusScale = z > -100 ? maxFocusScale
            : z > -400 ? 1 + ((z + 400) / 300) * (maxFocusScale - 1)
            : 1;

          card.style.transform = `translate(-50%, -50%) scale(${scale * curHS * focusScale})`;

          let opacity = 0.02;
          if (z < -3600) {
            opacity = 0.12;
          } else if (z < -1600) {
            opacity = 0.12 + ((z + 3600) / 2000) * 0.65;
          } else if (z < -400) {
            opacity = 0.77 + ((z + 1600) / 1200) * 0.23;
          } else if (z < 150) {
            opacity = 1;
          } else {
            opacity = 0;
          }
          const finalOpacity = Math.max(0, Math.min(1, opacity));
          card.style.opacity = String(finalOpacity);

          if (finalOpacity < 0.15) {
            card.style.pointerEvents = 'none';
            card.style.zIndex = '1';
          } else {
            card.style.pointerEvents = 'auto';
            card.style.zIndex = String(Math.round(z + 3000));
          }
        });

        animRef.current = requestAnimationFrame(tick);
      } catch (e) {}
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [mounted]);

  // Scroll / Touch inputs
  useEffect(() => {
    if (!mounted) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZOffsetRef.current += e.deltaY * 1.8;
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      targetZOffsetRef.current += deltaY * 0.8;
      touchStartY = touchY;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [mounted]);

  // Keys & Esc listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxId !== null) {
          setLightboxId(null);
        } else {
          router.push('/#gallery-showcase');
        }
      } else if (lightboxId !== null) {
        const currentIdx = PHOTOS.findIndex(p => p.id === lightboxId);
        if (e.key === 'ArrowLeft' && currentIdx > 0) {
          setLightboxId(PHOTOS[currentIdx - 1].id);
        } else if (e.key === 'ArrowRight' && currentIdx >= 0 && currentIdx < PHOTOS.length - 1) {
          setLightboxId(PHOTOS[currentIdx + 1].id);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxId, router]);

  const currentIdx = lightboxId !== null ? PHOTOS.findIndex(p => p.id === lightboxId) : -1;
  const currentPhoto = currentIdx >= 0 ? PHOTOS[currentIdx] : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .gl-root { box-sizing: border-box; }
        .gl-root * { box-sizing: border-box; }

        .gl-root {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #F5F1E5;
          perspective: 1200px;
        }

        /* 3D Tunnel scene */
        .tunnel-right-scene {
          width: 100vw;
          height: 100vh;
          position: absolute;
          inset: 0;
          perspective: 1400px;
          perspective-origin: 50% 50%;
          overflow: hidden;
        }

        .tunnel-card {
          position: absolute;
          border: 1px solid #030404;
          border-radius: 12px;
          overflow: hidden;
          will-change: opacity;
          transform-style: preserve-3d;
          cursor: pointer;
          opacity: 0.15;
          transition: opacity 0.25s ease;
          width: clamp(120px, 16vw, 260px);
          aspect-ratio: 3 / 2;
        }

        @media (max-width: 768px) {
          .tunnel-card {
            width: clamp(100px, 45vw, 180px);
            aspect-ratio: 2 / 3;
          }
        }

        .tunnel-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          border-radius: 10px;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: auto;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        /* Neo-Brutalism Exit button */
        .tunnel-exit-btn {
          position: absolute;
          top: 110px;
          left: 32px;
          z-index: 20;
          background: #FF9A00; 
          border: 3.5px solid #030404; 
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 6px 6px 0px 0px #030404;
          transition: all 0.2s ease-in-out;
        }
        .tunnel-exit-btn:hover {
          background: #FF9A00;
        }
        .tunnel-exit-btn:active {
          opacity: 0.85;
        }

        /* Lightbox styling */
        .gp-lb-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(245, 241, 229, 0.96);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gp-lb-img {
          max-width: 94vw;
          max-height: 92vh;
          object-fit: contain;
          border: 1px solid #030404;
          border-radius: 20px;
        }

        .gp-lb-close {
          position: fixed;
          top: 24px;
          right: 30px;
          font-size: 3rem;
          font-weight: 900;
          color: #030404;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 100000;
        }
        .gp-lb-close:hover { color: #FF9A00; }

        .gp-lb-arrow {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          border-radius: 12px;
          border: 3px solid #030404;
          background: #F5F1E5;
          color: #030404;
          font-size: 1.8rem;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 4px 4px 0px 0px #030404;
          transition: all 0.2s ease-in-out;
          z-index: 100000;
        }
        .gp-lb-arrow:hover { 
          background: #FF9A00;
        }
        .gp-lb-prev { left: 24px; }
        .gp-lb-next { right: 24px; }

        @media (max-width: 768px) {
          .gp-lb-arrow {
            top: auto;
            bottom: 24px;
            transform: none;
            width: 48px;
            height: 48px;
          }
          .gp-lb-prev {
            left: calc(50% - 60px);
          }
          .gp-lb-next {
            right: calc(50% - 60px);
            left: auto;
          }
        }
      `}} />

      <div className="gl-root">
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: '#F5F1E5',
            overflow: 'hidden',
            zIndex: 30,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="tunnel-right-scene">
            <ThemeBackground />

            {/* Scene container */}
            <div ref={tunnelRef} style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              zIndex: 10,
            }} />

            {/* Exit the Magic */}
            <Link 
              href="/#gallery-showcase"
              className="tunnel-exit-btn"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: '#030404', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 800 }}>
                Go Back
              </span>
            </Link>

            {/* Scroll Hint overlay */}
            <AnimatePresence>
              {showScrollHint && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(3, 4, 4, 0.75)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    textAlign: 'center',
                  }}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    style={{
                      maxWidth: '90%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <span style={{ 
                      fontFamily: "'Syne', sans-serif",
                      fontSize: '13px', 
                      color: '#FF9A00', 
                      fontWeight: 800, 
                      letterSpacing: '0.3em', 
                      textTransform: 'uppercase', 
                      textShadow: '0 2px 10px rgba(255, 154, 0, 0.3)'
                    }}>
                      Aarambh Gallery
                    </span>
                    <h2 style={{ 
                      fontFamily: "'Syne', sans-serif", 
                      fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
                      color: '#F5F1E5', 
                      fontWeight: 900, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      lineHeight: 1.2,
                      margin: 0,
                      textShadow: '0 4px 20px rgba(0,0,0,0.6)'
                    }}>
                      Scroll down to experience
                    </h2>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vignettes & Fades */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(245, 241, 229, 0.70) 70%, rgba(245, 241, 229, 1) 100%)',
              pointerEvents: 'none',
              zIndex: 5,
            }} />

            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: '120px',
              background: 'linear-gradient(to bottom, rgba(245, 241, 229, 1), transparent)',
              pointerEvents: 'none', zIndex: 5,
            }} />

            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0, height: '120px',
              background: 'linear-gradient(to top, rgba(245, 241, 229, 1), transparent)',
              pointerEvents: 'none', zIndex: 5,
            }} />
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxId !== null && currentPhoto && (
          <motion.div
            className="gp-lb-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setLightboxId(null)}
          >
            <motion.img
              key={currentPhoto.id}
              className="gp-lb-img"
              src={currentPhoto.src}
              alt={currentPhoto.label}
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.86, opacity: 0 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            <button className="gp-lb-close" onClick={() => setLightboxId(null)}>×</button>

            {currentIdx > 0 && (
              <button className="gp-lb-arrow gp-lb-prev"
                onClick={e => {
                  e.stopPropagation();
                  setLightboxId(PHOTOS[currentIdx - 1].id);
                }}>‹</button>
            )}
            {currentIdx < PHOTOS.length - 1 && (
              <button className="gp-lb-arrow gp-lb-next"
                onClick={e => {
                  e.stopPropagation();
                  setLightboxId(PHOTOS[currentIdx + 1].id);
                }}>›</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
