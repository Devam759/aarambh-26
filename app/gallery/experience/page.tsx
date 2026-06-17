import React from 'react';
import ExperienceTunnel from '@/components/gallery/ExperienceTunnel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery Experience',
  description: 'Explore the high-energy visual journey, pop-art designs, memories, and immersive experiences captured during Aarambh \'26.',
  alternates: {
    canonical: '/gallery/experience',
  },
};

export default function GalleryPage() {
  return <ExperienceTunnel />;
}
