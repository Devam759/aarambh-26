import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Rules & Regulations",
  description: "Official rules and guidelines for Aarambh '26 orientation at JK Lakshmipat University. Learn about campus policies, check-in instructions, UGC zero-tolerance directives, and code of conduct.",
  alternates: {
    canonical: '/rules',
  },
  openGraph: {
    title: "Rules & Regulations | Aarambh '26",
    description: "Official rules and guidelines for Aarambh '26 orientation. Learn about campus safety policies, hostel rules, and the university code of conduct.",
    type: 'website'
  }
};

export default function RulesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
