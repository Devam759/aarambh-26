'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ThemeBackground from '@/components/layout/ThemeBackground'

import { PHOTOS, type Photo } from '@/constants/photos'

// Populate sliding banner lists with larger variety of photos
const col1Images = PHOTOS.slice(0, 16).map(p => p.src)
const col2Images = PHOTOS.slice(16, 32).map(p => p.src)
const col3Images = PHOTOS.slice(32, 48).map(p => p.src)
const col4Images = PHOTOS.slice(48, 64).map(p => p.src)

// 3D Tunnel Position Map — Desktop (landscape)
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
]

// Mobile wall positions tuned for portrait 9:16 screens
const WALL_POSITIONS_MOBILE = [
  { left: '-15%', top: '5%'   },
  { left: '30%',  top: '-15%' },
  { left: '70%',  top: '-15%' },
  { left: '115%', top: '5%'  },
  { left: '115%', top: '30%' },
  { left: '115%', top: '55%' },
  { left: '115%', top: '80%' },
  { left: '70%',  top: '115%' },
  { left: '30%',  top: '115%' },
  { left: '-15%', top: '80%'  },
  { left: '-15%', top: '55%'  },
  { left: '-15%', top: '30%'  },
]

const CARD_COUNT = 64
const BASE_Z_STEP = 90
const BASE_Z_FAR = -5760

export default function GalleryLanding() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isEntered, setIsEntered] = useState(true)
  const [showScrollHint, setShowScrollHint] = useState(true)
  const [lightboxId, setLightboxId] = useState<number | null>(null)

  // 3D Card tilt motion values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for card tilt
  const rotateX = useSpring(useTransform(y, [-200, 200], [18, -18]), { damping: 24, stiffness: 260 })
  const rotateY = useSpring(useTransform(x, [-200, 200], [-18, 18]), { damping: 24, stiffness: 260 })

  // 3D Tunnel Refs and Offset tracking
  const tunnelRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number | null>(null)
  const zOffsetRef = useRef(0)
  const targetZOffsetRef = useRef(0)
  // Sequential counter so recycled cards always get the NEXT photo in order — no random swaps
  const recycleCounterRef = useRef(CARD_COUNT % PHOTOS.length)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // ── Tunnel Setup and Animation Loop ──
  useEffect(() => {
    if (!mounted || !tunnelRef.current) return

    const isMobile = window.innerWidth <= 768
    const cardCount = isMobile ? 48 : CARD_COUNT
    const zStep = isMobile ? 100 : BASE_Z_STEP
    const zFar = isMobile ? -4800 : BASE_Z_FAR
    const wallPositions = isMobile ? WALL_POSITIONS_MOBILE : WALL_POSITIONS

    recycleCounterRef.current = cardCount % PHOTOS.length

    const scene = tunnelRef.current
    scene.innerHTML = ''

    for (let i = 0; i < cardCount; i++) {
      const wallIdx = i % wallPositions.length
      const baseZ = zFar + (i * zStep)
      const photoIdx = i % PHOTOS.length
      const photo = PHOTOS[photoIdx]

      const card = document.createElement('div')
      card.className = 'tunnel-card'
      card.dataset.hoverScale = "1"
      card.dataset.baseZ = String(baseZ)
      card.dataset.wallIdx = String(wallIdx)
      card.dataset.photoIdx = String(photoIdx)
      // Store photoId and photoSrc in dataset – animation loop keeps these in sync
      card.dataset.photoId = String(photo.id)
      card.dataset.photoSrc = photo.src

      card.onmouseenter = () => {
        card.dataset.hoverScale = "1.08"
      }
      card.onmouseleave = () => {
        card.dataset.hoverScale = "1"
      }

      card.style.left = '50%'
      card.style.top = '50%'

      const img = document.createElement('img')
      img.src = photo.src
      img.alt = photo.label
      img.loading = 'lazy'
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;border-radius:10px;'
      img.onerror = () => {
        card.style.background = '#030404'
      }

      card.appendChild(img)

      // Read photoId directly from dataset (animation loop keeps it in sync with img.src)
      card.addEventListener('click', () => {
        const photoId = parseInt(card.dataset.photoId || '0', 10)
        const found = PHOTOS.find(p => p.id === photoId)
        if (found) {
          setLightboxId(found.id)
        }
      })

      scene.appendChild(card)
    }

    const tick = () => {
      try {
        const diff = targetZOffsetRef.current - zOffsetRef.current
        zOffsetRef.current += diff * (isMobile ? 0.35 : 0.15)

        if (Math.abs(zOffsetRef.current) > 60) {
          setShowScrollHint(false)
        }

        const cards = scene.querySelectorAll<HTMLElement>('.tunnel-card')
        if (!cards || cards.length === 0) {
          animRef.current = requestAnimationFrame(tick)
          return
        }

        cards.forEach((card) => {
          const rawBaseZ = card.dataset.baseZ
          const baseZ = rawBaseZ ? parseFloat(rawBaseZ) : 0
          let z = baseZ + zOffsetRef.current

          if (z > 300) {
            // Card flew past the viewer — send it to the far back
            const newBaseZ = baseZ - (cardCount * zStep)
            card.dataset.baseZ = String(newBaseZ)
            z = newBaseZ + zOffsetRef.current

            const oldWallPos = parseInt(card.dataset.wallIdx || '0')
            const newWallPos = (oldWallPos + 3) % wallPositions.length
            card.dataset.wallIdx = String(newWallPos)

            // Use sequential counter — NOT random — so images never jump unexpectedly
            const nextIdx = recycleCounterRef.current % PHOTOS.length
            recycleCounterRef.current = (recycleCounterRef.current + 1) % PHOTOS.length
            const nextPhoto = PHOTOS[nextIdx]
            const img = card.querySelector('img')
            if (img && nextPhoto) {
              img.setAttribute('src', nextPhoto.src)
              card.dataset.photoId = String(nextPhoto.id)
              card.dataset.photoSrc = nextPhoto.src
            }
          } else if (z < zFar - 100) {
            // Card scrolled backward past the far end — bring it to the front
            const newBaseZ = baseZ + (cardCount * zStep)
            card.dataset.baseZ = String(newBaseZ)
            z = newBaseZ + zOffsetRef.current

            const oldWallPos = parseInt(card.dataset.wallIdx || '0')
            const newWallPos = (oldWallPos - 3 + wallPositions.length) % wallPositions.length
            card.dataset.wallIdx = String(newWallPos)

            // Sequential counter for backward scrolling too
            const nextIdx = ((recycleCounterRef.current - 1) + PHOTOS.length) % PHOTOS.length
            recycleCounterRef.current = nextIdx
            const nextPhoto = PHOTOS[nextIdx]
            const img = card.querySelector('img')
            if (img && nextPhoto) {
              img.setAttribute('src', nextPhoto.src)
              card.dataset.photoId = String(nextPhoto.id)
              card.dataset.photoSrc = nextPhoto.src
            }
          }

          const wallPos = wallPositions[parseInt(card.dataset.wallIdx || '0')]
          const depthFactor = Math.max(0, Math.min(1, (z + 3600) / 3600))
          const easeInCubic = Math.pow(depthFactor, 3)

          const startLeft = parseFloat(wallPos.left)
          const startTop = parseFloat(wallPos.top)

          const currentLeft = startLeft + (50 - startLeft) * easeInCubic
          const currentTop = startTop + (55 - startTop) * easeInCubic

          card.style.left = `${currentLeft}%`
          card.style.top = `${currentTop}%`

          const scale = 1400 / (1400 - z)
          
          let curHS = parseFloat(card.dataset.currentHoverScale || "1")
          const targetHS = parseFloat(card.dataset.hoverScale || "1")
          curHS += (targetHS - curHS) * 0.18
          card.dataset.currentHoverScale = String(curHS)

          // Boost scale only for cards in the focal/foreground zone — tunnel cards stay original size
          const isMobileViewport = window.innerWidth <= 768
          const maxFocusScale = isMobileViewport ? 1.2 : 1.6
          const focusScale = z > -100 ? maxFocusScale
            : z > -400 ? 1 + ((z + 400) / 300) * (maxFocusScale - 1)
            : 1

          card.style.transform = `translate(-50%, -50%) scale(${scale * curHS * focusScale})`

          let opacity = 0.02
          if (z < -3600) {
            opacity = 0.12
          } else if (z < -1600) {
            opacity = 0.12 + ((z + 3600) / 2000) * 0.65
          } else if (z < -400) {
            opacity = 0.77 + ((z + 1600) / 1200) * 0.23
          } else if (z < 150) {
            opacity = 1
          } else {
            opacity = 0
          }
          const finalOpacity = Math.max(0, Math.min(1, opacity))
          card.style.opacity = String(finalOpacity)

          // KEY FIX: invisible/fading cards must NEVER intercept clicks.
          // Only cards that are clearly visible (opacity > 0.15) should be clickable.
          // Also cap z-index so fading-out cards (z≥150) can't float above visible ones.
          if (finalOpacity < 0.15) {
            card.style.pointerEvents = 'none'
            card.style.zIndex = '1'  // push invisible cards to the very bottom
          } else {
            card.style.pointerEvents = 'auto'
            // z-index based on depth: closer cards (higher z) get higher index
            card.style.zIndex = String(Math.round(z + 3000))
          }
        })

        animRef.current = requestAnimationFrame(tick)
      } catch (e) {}
    }

    animRef.current = requestAnimationFrame(tick)

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
      }
    }
  }, [isEntered, mounted])

  // Scroll/Touch inputs
  useEffect(() => {
    if (!mounted) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetZOffsetRef.current += e.deltaY * 1.8
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY - touchY
      // Increased sensitivity on mobile for a snappier feel
      targetZOffsetRef.current += deltaY * 4.5
      touchStartY = touchY
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [mounted])

  // Keypress listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxId !== null) {
          setLightboxId(null)
        } else {
          router.push('/#gallery-showcase')
        }
      } else if (lightboxId !== null) {
        const currentIdx = PHOTOS.findIndex(p => p.id === lightboxId)
        if (e.key === 'ArrowLeft' && currentIdx > 0) {
          setLightboxId(PHOTOS[currentIdx - 1].id)
        } else if (e.key === 'ArrowRight' && currentIdx >= 0 && currentIdx < PHOTOS.length - 1) {
          setLightboxId(PHOTOS[currentIdx + 1].id)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxId, router])

  const currentIdx = lightboxId !== null ? PHOTOS.findIndex(p => p.id === lightboxId) : -1
  const currentPhoto = currentIdx >= 0 ? PHOTOS[currentIdx] : null



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
          transform-style: preserve-3d;
        }

        /* sliding photo columns */
        .gl-slider-column {
          position: absolute;
          top: -10%;
          width: 100px;
          height: 120%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 14px;
          z-index: 2;
          pointer-events: none;
          opacity: 0.75;
        }

        .gl-slider-img-container {
          width: 100%;
          height: 130px;
          position: relative;
          border: 1px solid #030404;
          border-radius: 10px;
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
        }

        .gl-slider-track-down {
          display: flex;
          flex-direction: column;
          gap: 22px;
          animation: slideDown 24s linear infinite;
        }

        @media (max-width: 1200px) {
          .gl-slider-column.inner {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .gl-slider-column {
            display: none !important;
          }
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
          color: #FF9A00;
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
            2px 2px 0 #FF9A00,
            -2px -2px 0 #FF9A00,
            2px -2px 0 #FF9A00,
            -2px 2px 0 #FF9A00,
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
          color: #F5F1E5;
          background: #FF9A00;
          border: 3.5px solid #030404;
          border-radius: 12px;
          padding: 14px 28px;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 5px 5px 0px 0px #030404;
          transition: all 0.2s ease-in-out;
        }
        .gl-cta:hover {
          background: #FF9A00;
          color: #030404;
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
            width: clamp(90px, 36vw, 160px);
            aspect-ratio: 3 / 4;
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

        /* Neo-Brutalism Exit the Magic button */
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

        /* Neo-Brutalism Scroll to Explore pill */
        .tunnel-controls-pill {
          position: absolute;
          top: 110px;
          right: 32px;
          z-index: 10;
          background: #F5F1E5;
          border: 3.5px solid #030404;
          border-radius: 12px;
          padding: 12px 24px;
          box-shadow: 6px 6px 0px 0px #030404;
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

        @media (max-width: 768px) {
          .gp-lb-img {
            max-width: 98vw;
            max-height: 92vh;
            border-radius: 12px;
          }
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
          .tunnel-controls-pill {
            display: none !important;
          }
          .tunnel-exit-btn {
            top: 90px;
            left: 50%;
            transform: translateX(-50%) translate(0, 0);
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

      <div className="gl-root">
        {/* Render 3D Tunnel directly when entered */}
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



            {/* Translucent overlay with clean floating text */}
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
                e.currentTarget.style.display = 'none'
              }}
            />

            <button className="gp-lb-close" onClick={() => setLightboxId(null)}>×</button>

            {currentIdx > 0 && (
              <button className="gp-lb-arrow gp-lb-prev"
                onClick={e => {
                  e.stopPropagation()
                  setLightboxId(PHOTOS[currentIdx - 1].id)
                }}>‹</button>
            )}
            {currentIdx < PHOTOS.length - 1 && (
              <button className="gp-lb-arrow gp-lb-next"
                onClick={e => {
                  e.stopPropagation()
                  setLightboxId(PHOTOS[currentIdx + 1].id)
                }}>›</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
