'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const CARD_COUNT = 32;
const BASE_Z_FAR = -5120;
const BASE_Z_STEP = 160;

export default function ExperienceTunnel() {
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const zOffsetRef = useRef(0);
  const targetZOffsetRef = useRef(0);

  useEffect(() => {
    if (!tunnelRef.current) return;

    const scene = tunnelRef.current;
    scene.innerHTML = '';
    zOffsetRef.current = 0;

    for (let i = 0; i < CARD_COUNT; i++) {
      const wallIdx = i % WALL_POSITIONS.length;
      const baseZ = BASE_Z_FAR + (i * BASE_Z_STEP);
      const photoIdx = i % PHOTOS.length;
      const photo = PHOTOS[photoIdx];

      const card = document.createElement('div');
      card.className = 'tunnel-card';

      card.dataset.hoverScale = "1";
      card.onmouseenter = () => {
        card.dataset.hoverScale = "1.08";
      };
      card.onmouseleave = () => {
        card.dataset.hoverScale = "1";
      };

      card.dataset.baseZ = String(baseZ);
      card.dataset.wallIdx = String(wallIdx);
      card.dataset.photoIdx = String(photoIdx);

      card.style.left = '50%';
      card.style.top = '50%';

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.label;
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;';
      img.onerror = () => {
        card.style.background = '#1a1a1a';
      };

      card.appendChild(img);
      card.addEventListener('click', () => {
        setLightboxId(PHOTOS[photoIdx].id);
      });

      scene.appendChild(card);
    }

    return () => {
      if (tunnelRef.current) {
        tunnelRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      try {
        const diff = targetZOffsetRef.current - zOffsetRef.current;
        zOffsetRef.current += diff * 0.08;

        const cards = tunnelRef.current?.querySelectorAll<HTMLElement>('.tunnel-card');

        const debugDiv = document.getElementById('tunnel-debug');
        if (debugDiv) {
          debugDiv.innerText = `Target Z: ${targetZOffsetRef.current.toFixed(1)} | Offset Z: ${zOffsetRef.current.toFixed(1)} | Cards: ${cards ? cards.length : 0}`;
        }

        if (!cards || cards.length === 0) {
          animRef.current = requestAnimationFrame(tick);
          return;
        }

        cards.forEach((card) => {
          const rawBaseZ = card.dataset.baseZ;
          const baseZ = rawBaseZ ? parseFloat(rawBaseZ) : 0;
          if (isNaN(baseZ)) return;

          let z = baseZ + zOffsetRef.current;

          if (z > 300) {
            const newBaseZ = baseZ - (CARD_COUNT * BASE_Z_STEP);
            card.dataset.baseZ = String(newBaseZ);
            z = newBaseZ + zOffsetRef.current;

            const oldWallPos = parseInt(card.dataset.wallIdx || '0');
            const newWallPos = (oldWallPos + 3) % WALL_POSITIONS.length;
            card.dataset.wallIdx = String(newWallPos);

            if (PHOTOS.length > 0) {
              const currentlyUsed = new Set(
                Array.from(tunnelRef.current?.querySelectorAll('[data-photo-idx]') || [])
                  .map(c => parseInt((c as HTMLElement).dataset.photoIdx || '-1'))
              );
              let available = Array.from({ length: PHOTOS.length }, (_, idx) => idx).filter(idx => !currentlyUsed.has(idx));
              if (available.length === 0) available = Array.from({ length: PHOTOS.length }, (_, idx) => idx);
              const newPhotoIdx = available[Math.floor(Math.random() * available.length)];
              card.dataset.photoIdx = String(newPhotoIdx);
              const img = card.querySelector('img') as HTMLImageElement | null;
              if (img && PHOTOS[newPhotoIdx]) {
                img.src = PHOTOS[newPhotoIdx].src;
                img.alt = PHOTOS[newPhotoIdx].label;
              }
            }
          } else if (z < BASE_Z_FAR - 100) {
            const newBaseZ = baseZ + (CARD_COUNT * BASE_Z_STEP);
            card.dataset.baseZ = String(newBaseZ);
            z = newBaseZ + zOffsetRef.current;

            const oldWallPos = parseInt(card.dataset.wallIdx || '0');
            const newWallPos = (oldWallPos - 3 + WALL_POSITIONS.length) % WALL_POSITIONS.length;
            card.dataset.wallIdx = String(newWallPos);

            if (PHOTOS.length > 0) {
              const currentlyUsed = new Set(
                Array.from(tunnelRef.current?.querySelectorAll('[data-photo-idx]') || [])
                  .map(c => parseInt((c as HTMLElement).dataset.photoIdx || '-1'))
              );
              let available = Array.from({ length: PHOTOS.length }, (_, idx) => idx).filter(idx => !currentlyUsed.has(idx));
              if (available.length === 0) available = Array.from({ length: PHOTOS.length }, (_, idx) => idx);
              const newPhotoIdx = available[Math.floor(Math.random() * available.length)];
              card.dataset.photoIdx = String(newPhotoIdx);
              const img = card.querySelector('img') as HTMLImageElement | null;
              if (img && PHOTOS[newPhotoIdx]) {
                img.src = PHOTOS[newPhotoIdx].src;
                img.alt = PHOTOS[newPhotoIdx].label;
              }
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

          const scale = 800 / (800 - z);
          
          let curHS = parseFloat(card.dataset.currentHoverScale || "1");
          const targetHS = parseFloat(card.dataset.hoverScale || "1");
          curHS += (targetHS - curHS) * 0.18;
          card.dataset.currentHoverScale = String(curHS);

          card.style.transform = `translate(-50%, -50%) scale(${scale * curHS})`;
          card.style.zIndex = String(Math.round(z + 3000));

          let opacity = 0.02;
          if (z < -3600) {
            opacity = 0.12;
          } else if (z < -1600) {
            opacity = 0.12 + ((z + 3600) / 2000) * 0.65;
          } else if (z < -400) {
            opacity = 0.77 + ((z + 1600) / 1200) * 0.23;
          } else if (z < 200) {
            opacity = 1;
          } else {
            opacity = 0;
          }

          card.style.opacity = String(Math.max(0, Math.min(1, opacity)));
        });

        animRef.current = requestAnimationFrame(tick);
      } catch (err) {}
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZOffsetRef.current += e.deltaY * 2.0;
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      targetZOffsetRef.current += deltaY * 3.5;
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
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxId !== null) {
          setLightboxId(null);
        } else if (window.scrollY > 50) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxId]);

  const currentIdx = lightboxId !== null ? PHOTOS.findIndex(p => p.id === lightboxId) : -1;
  const currentPhoto = currentIdx >= 0 ? PHOTOS[currentIdx] : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .gp-root {
          background: #030404;
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          overflow-x: hidden;
          z-index: 10;
        }

        .tunnel-right {
          width: 100vw;
          height: 100vh;
          position: relative;
          perspective: 800px;
          perspective-origin: 50% 50%;
          overflow: hidden;
          background: transparent;
        }

        .tunnel-card {
          position: absolute;
          width: clamp(160px, 20vw, 300px);
          aspect-ratio: 3 / 2;
          border: 1px solid #030404;
          border-radius: 8px;
          overflow: hidden;
          will-change: transform, opacity;
          transform-style: preserve-3d;
          cursor: pointer;
          opacity: 0.15;
          transition: opacity 0.25s ease;
        }

        .tunnel-exit-btn {
          position: absolute;
          top: 110px;
          left: 24px;
          z-index: 20;
          border-radius: 999px;
          padding: 6px 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(255, 24, 140, 0.1);
          transition: all 0.3s ease;
        }

        .tunnel-controls-pill {
          position: absolute;
          top: 110px;
          right: 24px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(3, 4, 4, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 24, 140, 0.35);
          border-radius: 999px;
          padding: 6px 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(255, 24, 140, 0.1);
          transition: all 0.3s ease;
        }

        .gp-lb-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0,0,0,0.95);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gp-lb-img {
          max-width: 86vw;
          max-height: 82vh;
          object-fit: contain;
          border: 1px solid #030404;
          border-radius: 8px;
        }

        .gp-lb-close {
          position: fixed;
          top: 24px; right: 30px;
          font-size: 2.5rem;
          line-height: 1;
          color: rgba(255,255,255,0.6);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          z-index: 100000;
        }
        .gp-lb-close:hover { color: #C0580A; }

        .gp-lb-arrow {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: rgba(0,0,0,0.4);
          color: rgba(255,255,255,0.7);
          font-size: 1.5rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          z-index: 100000;
        }
        .gp-lb-arrow:hover { 
          border-color: #C0580A; 
          color: #ffffff; 
          background: #C0580A;
        }
        .gp-lb-prev { left: 24px; }
        .gp-lb-next { right: 24px; }

        @media (max-width: 768px) {
          .tunnel-right {
            height: 100vh !important;
          }
          .tunnel-card {
            width: clamp(80px, 15vw, 150px) !important;
          }
          .tunnel-controls-pill {
            display: none !important;
          }
          .tunnel-exit-btn {
            top: 90px;
            left: 50%;
            transform: translateX(-50%);
          }
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

      <div className="gp-root">
        <motion.div 
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            background: '#F5F1E5',
            overflow: 'hidden',
          }}
          id="gp-memories"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="tunnel-right" style={{ position: 'absolute', inset: 0 }}>
            <ThemeBackground />

            {/* Debug Panel */}
            <div id="tunnel-debug" style={{
              display: 'none',
              position: 'absolute',
              top: '110px',
              left: '40px',
              background: 'rgba(245, 241, 229, 0.6)',
              color: 'rgba(3, 4, 4, 0.7)',
              fontFamily: 'monospace',
              fontSize: '10px',
              padding: '6px 12px',
              borderRadius: '4px',
              zIndex: 20,
              pointerEvents: 'none',
            }}>Initializing debug...</div>

            {/* Scene */}
            <div ref={tunnelRef} style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              zIndex: 10,
            }} />

            {/* EXIT THE MAGIC button */}
            <button 
              onClick={() => { window.location.href = '/gallery' }}
              className="tunnel-exit-btn"
              style={{ 
                background: '#030404', 
                border: '1px solid rgba(255,154,0,0.5)', 
                padding: '12px 24px',
                borderRadius: '30px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255,154,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,154,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,154,0,0.1)';
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontSize: '10px', color: '#FF9A00', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                Exit the magic
              </span>
            </button>

            {/* Scroll to explore */}
            <div className="tunnel-controls-pill" style={{ background: '#030404', border: '1px solid rgba(255,154,0,0.3)', zIndex: 20 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: '9px', color: '#F5F1E5', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                Scroll to explore
              </span>
            </div>

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

            <div style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              zIndex: 5,
              pointerEvents: 'none',
              fontFamily: "var(--font-display)",
              fontSize: '10px',
              color: 'rgba(3, 4, 4, 0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 800
            }}>
              Scroll up or ESC to return
            </div>
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
