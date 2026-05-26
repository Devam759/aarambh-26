'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import ThemeBackground from '@/components/layout/ThemeBackground'

export default function GalleryLanding() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Google Fonts — Syne + Tiro Devanagari */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&family=Tiro+Devanagari+Hindi&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #F5F1E5; /* brand-cloud */
          overflow: hidden;
          font-family: 'Syne', sans-serif;
          color: #030404; /* brand-ink */
        }

        .gl-root {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #F5F1E5;
        }

        /* Neo-Brutalism Card */
        .gl-card {
          position: relative;
          z-index: 10;
          width: clamp(320px, 88vw, 500px);
          background: rgba(245, 241, 229, 0.6);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 3px solid #030404;
          border-radius: 20px;
          padding: 48px 40px 44px;
          text-align: center;
          box-shadow: 16px 16px 0px 0px #030404;
          overflow: hidden;
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
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: 10px;
          color: #030404;
          letter-spacing: 0.05em;
          text-align: center;
          line-height: 1.1;
          animation: starSpin 10s linear infinite reverse;
        }

        /* Devanagari eyebrow */
        .gl-devanagari {
          font-family: 'Tiro Devanagari Hindi', serif;
          font-size: 1.2rem;
          color: #030404;
          margin-bottom: 8px;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        /* Eyebrow label */
        .gl-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #FF188C;
          margin-bottom: 24px;
        }

        /* Main heading */
        .gl-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.5rem, 8vw, 3.8rem);
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

        /* Divider */
        .gl-divider {
          width: 60px;
          height: 4px;
          background: #030404;
          border-radius: 99px;
          margin: 24px auto 24px;
        }

        /* Subtext */
        .gl-sub {
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #030404;
          letter-spacing: 0.02em;
          line-height: 1.6;
          margin-bottom: 36px;
        }

        /* CTA Button - Neo Brutalism */
        .gl-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #F5F1E5;
          background: #0D21DD;
          border: 2px solid #030404;
          border-radius: 12px;
          padding: 16px 36px;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 6px 6px 0px 0px #030404;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .gl-cta:hover {
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0px 0px #030404;
          background: #FF188C;
        }
        .gl-cta:active {
          transform: translate(4px, 4px);
          box-shadow: 2px 2px 0px 0px #030404;
        }

        /* Corner tags */
        .gl-corner-tag {
          position: absolute;
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #030404;
          pointer-events: none;
          z-index: 5;
        }

        /* Top bar for card */
        .gl-card-topbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 12px;
          background: #FF9A00;
          border-bottom: 3px solid #030404;
        }

      `}} />

      <div className="gl-root">
        <ThemeBackground />

        {/* Corner decorations */}
        <span className="gl-corner-tag" style={{ top: 32, left: 32 }}>JKLU · AARAMBH '26</span>
        <span className="gl-corner-tag" style={{ bottom: 32, right: 32 }}>GALLERY · REGISTRATION THEME</span>

        {/* Starburst top-right */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.34,1.56,0.64,1] }}
          style={{ position: 'absolute', top: '20%', right: '12%', zIndex: 15 }}
        >
          <div style={{ position: 'relative', width: 80, height: 80 }}>
            <div className="gl-starburst" />
            <div className="gl-starburst-text">NEW<br/>PICS!</div>
          </div>
        </motion.div>

        {/* Massive Background Typography (Matching Registration Page) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-15deg)',
          zIndex: 0,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'flex',
          gap: '3vw',
          alignItems: 'baseline'
        }}>
          <span style={{ 
            fontFamily: "'Tiro Devanagari Hindi', serif", 
            fontSize: 'clamp(8rem, 24vw, 22rem)', 
            fontWeight: 700, 
            color: '#030404', 
            textShadow: '8px 8px 0px #FF9A00',
            lineHeight: 0.8
          }}>आरम्भ</span>
          <span style={{ 
            fontFamily: "'Syne', sans-serif", 
            fontSize: 'clamp(8rem, 24vw, 22rem)', 
            fontWeight: 900, 
            color: '#030404', 
            textShadow: '8px 8px 0px #FF9A00',
            lineHeight: 0.8
          }}>26</span>
        </div>

        {/* Main Neo-Brutalism Card */}
        {mounted && (
          <motion.div
            className="gl-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="gl-card-topbar" />

            {/* Devanagari */}
            <div className="gl-devanagari">आरम्भ '२६</div>

            {/* Eyebrow */}
            <div className="gl-eyebrow">Aarambh '26 Gallery</div>

            {/* Main heading */}
            <h1 className="gl-heading">
              ENTER <br />
              <span className="gl-heading-highlight">MAGIC</span>
            </h1>

            {/* Divider */}
            <div className="gl-divider" />

            {/* Subtext */}
            <p className="gl-sub">
              Experience the energy, boldness, and limitless possibilities. 
              Scroll to explore every captured moment of Aarambh.
            </p>

            {/* CTA */}
            <Link href="/gallery/experience" className="gl-cta">
              Begin Experience →
            </Link>
          </motion.div>
        )}
      </div>
    </>
  )
}
