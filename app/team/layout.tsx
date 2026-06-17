import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the core team, coordinators, and volunteers behind Aarambh 2026 at JK Lakshmipat University.',
  alternates: {
    canonical: '/team',
  },
  openGraph: {
    title: 'Our Team | Aarambh 2026',
    description: 'Meet the team behind Aarambh 2026 at JK Lakshmipat University.',
    url: 'https://aarambh.jklu.edu.in/team',
  },
};


export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
