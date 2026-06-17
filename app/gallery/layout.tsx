import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery & Experience',
  description: 'Explore the high-energy visual journey, pop-art designs, memories, and immersive experiences captured during Aarambh \'26 at JK Lakshmipat University.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Gallery & Experience | AARAMBH\'26',
    description: 'Explore the high-energy visual journey, pop-art designs, memories, and immersive experiences captured during Aarambh \'26.',
  }
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
