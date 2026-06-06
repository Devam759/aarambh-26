'use client';

import React, { useEffect, useState } from 'react';
import MobileGallery from '@/components/gallery/MobileGallery';
import TunnelGallery from '@/components/gallery/TunnelGallery';

export default function GalleryLanding() {
  const [mounted, setMounted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobileDevice(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 bg-[#F5F1E5]" />;
  }

  if (isMobileDevice) {
    return <MobileGallery />;
  }

  return <TunnelGallery />;
}
