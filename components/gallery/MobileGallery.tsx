'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PHOTOS } from '@/constants/photos';

export default function MobileGallery() {
  const [lightboxId, setLightboxId] = useState<number | null>(null);

  const currentIdx = lightboxId !== null ? PHOTOS.findIndex(p => p.id === lightboxId) : -1;
  const currentPhoto = currentIdx >= 0 ? PHOTOS[currentIdx] : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { overflow: auto !important; }
        .mob-gallery-root {
          min-height: 100vh;
          background: #F5F1E5;
          padding: 0;
          padding-bottom: 40px;
          font-family: var(--font-display, 'Syne', sans-serif);
        }
        .mob-gallery-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #F5F1E5;
          border-bottom: 3.5px solid #030404;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mob-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FF9A00;
          border: 3px solid #030404;
          border-radius: 10px;
          padding: 8px 14px;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #030404;
          text-decoration: none;
          box-shadow: 4px 4px 0px 0px #030404;
        }
        .mob-back-btn:active { transform: translate(2px,2px); box-shadow: 1px 1px 0px 0px #030404; }
        .mob-gallery-title {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #030404;
        }
        .mob-gallery-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 14px 12px;
        }
        .mob-gallery-card {
          aspect-ratio: 2 / 3;
          border: 3px solid #030404;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 4px 4px 0px 0px #030404;
          cursor: pointer;
          background: #030404;
          position: relative;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .mob-gallery-card:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0px 0px #030404;
        }
        .mob-gallery-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .mob-lb-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(3,4,4,0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .mob-lb-img {
          max-width: 100%;
          max-height: 88vh;
          object-fit: contain;
          border: 3px solid #030404;
          border-radius: 12px;
          box-shadow: 6px 6px 0px 0px #FF9A00;
        }
        .mob-lb-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: 16px;
          gap: 12px;
        }
        .mob-lb-arrow {
          flex: 1;
          padding: 14px;
          background: #F5F1E5;
          border: 3px solid #030404;
          border-radius: 10px;
          font-size: 1.6rem;
          font-weight: 900;
          box-shadow: 3px 3px 0px 0px #030404;
          text-align: center;
          cursor: pointer;
        }
        .mob-lb-arrow:active { transform: translate(2px,2px); box-shadow: none; }
        .mob-lb-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 44px;
          height: 44px;
          background: #FF188C;
          border: 3px solid #030404;
          border-radius: 10px;
          font-size: 1.6rem;
          font-weight: 900;
          color: #F5F1E5;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 3px 3px 0px 0px #030404;
          cursor: pointer;
        }
        .mob-lb-counter {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 12px;
          font-weight: 800;
          color: #F5F1E5;
          letter-spacing: 0.15em;
          margin-top: 10px;
        }
      `}} />

      <div className="mob-gallery-root">
        {/* Sticky Header */}
        <div className="mob-gallery-header">
          <Link href="/#gallery-showcase" className="mob-back-btn">
            ← Go Back
          </Link>
          <span className="mob-gallery-title">Gallery</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#FF9A00', letterSpacing: '0.1em' }}>
            {PHOTOS.length} PHOTOS
          </span>
        </div>

        {/* Portrait Grid */}
        <div className="mob-gallery-grid">
          {PHOTOS.map((photo) => (
            <div
              key={photo.id}
              className="mob-gallery-card"
              onClick={() => setLightboxId(photo.id)}
            >
              <Image
                src={photo.src}
                alt={photo.label}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Lightbox */}
      <AnimatePresence>
        {lightboxId !== null && currentPhoto && (
          <motion.div
            className="mob-lb-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <button className="mob-lb-close" onClick={() => setLightboxId(null)}>×</button>
            <motion.img
              key={currentPhoto.id}
              className="mob-lb-img"
              src={currentPhoto.src}
              alt={currentPhoto.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <div className="mob-lb-nav">
              <button
                className="mob-lb-arrow"
                disabled={currentIdx <= 0}
                style={{ opacity: currentIdx <= 0 ? 0.3 : 1 }}
                onClick={() => currentIdx > 0 && setLightboxId(PHOTOS[currentIdx - 1].id)}
              >‹</button>
              <button
                className="mob-lb-arrow"
                disabled={currentIdx >= PHOTOS.length - 1}
                style={{ opacity: currentIdx >= PHOTOS.length - 1 ? 0.3 : 1 }}
                onClick={() => currentIdx < PHOTOS.length - 1 && setLightboxId(PHOTOS[currentIdx + 1].id)}
              >›</button>
            </div>
            <span className="mob-lb-counter">{currentIdx + 1} / {PHOTOS.length}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
