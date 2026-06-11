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
          border-bottom: 1px solid rgba(3, 4, 4, 0.1);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mob-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #215798;
          border: none;
          border-radius: 8px;
          padding: 8px 14px;
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: white;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        .mob-back-btn:active { transform: scale(0.98); }
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
          border: 1px solid rgba(3, 4, 4, 0.1);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          background: #030404;
          position: relative;
          transition: transform 0.1s ease;
        }
        .mob-gallery-card:active {
          transform: scale(0.98);
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
          border: 1px solid rgba(3, 4, 4, 0.1);
          border-radius: 12px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
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
          padding: 12px;
          background: #F5F1E5;
          border: 1px solid rgba(3, 4, 4, 0.1);
          border-radius: 8px;
          font-size: 1.4rem;
          font-weight: 400;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mob-lb-arrow:active { transform: scale(0.98); }
        .mob-lb-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          background: #215798;
          border: none;
          border-radius: 50%;
          font-size: 1.4rem;
          font-weight: 400;
          color: #F5F1E5;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
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
