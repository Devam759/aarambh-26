import type { Metadata } from 'next';
import { EventSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: "Schedule & Timeline",
  description: "View the complete day-by-day orientation program schedule, timeline, and cultural events calendar for Aarambh '26 first-year orientation at JK Lakshmipat University.",
  alternates: {
    canonical: '/schedule',
  },
  openGraph: {
    title: "Schedule & Timeline | Aarambh '26",
    description: "View the complete day-by-day orientation program schedule, timeline, and cultural events calendar for Aarambh '26 first-year orientation.",
    type: 'website'
  }
};

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EventSchema />
      {children}
    </>
  );
}
