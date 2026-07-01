/**
 * StructuredData.tsx
 *
 * Drop-in JSON-LD components for the Aarambh '26 site (Next.js App Router).
 * Renders <script type="application/ld+json"> tags — invisible to users, read by
 * crawlers and AI engines that check structured data.
 */

import React from 'react';

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "JK Lakshmipat University",
    alternateName: "JKLU",
    url: "https://jklu.edu.in",
    logo: "https://aarambh.jklu.edu.in/logos/jklu_logo.svg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Near Mahindra SEZ, Ajmer Road",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      postalCode: "302026",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-141-7107500",
      email: "info@jklu.edu.in",
      contactType: "general inquiries",
    },
    sameAs: [
      "https://www.facebook.com/share/1Hsdb57Jcf/",
      "https://x.com/jklujaipur",
      "https://www.instagram.com/aarambh_jklu",
      "https://www.linkedin.com/school/jklujaipur/",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function EventSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: "Aarambh '26 — JKLU New Student Orientation",
    description:
      "Aarambh 2026 is the official New Student Orientation and Welcome Festival of JK Lakshmipat University, Jaipur, featuring academic orientation, campus integration sessions, and themed cultural days.",
    startDate: "2026-07-14",
    endDate: "2026-07-21",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "JK Lakshmipat University",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Near Mahindra SEZ, Ajmer Road",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        postalCode: "302026",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "EducationalOrganization",
      name: "JK Lakshmipat University, Office of Student Affairs",
      url: "https://jklu.edu.in",
    },
    image: ["https://aarambh.jklu.edu.in/aarambh-2025-poster.jpg"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqSchema() {
  const faqs = [
    {
      question: "What is Aarambh 2026?",
      answer:
        "Aarambh 2026 is the official New Student Orientation and Welcome Festival of JK Lakshmipat University (JKLU), Jaipur, held for incoming students from July 14 to July 21, 2026.",
    },
    {
      question: "When is Aarambh 2026?",
      answer:
        "Aarambh 2026 runs for eight days, from July 14 to July 21, 2026, at the JK Lakshmipat University campus in Jaipur, Rajasthan.",
    },
    {
      question: "What are the daily themes for Aarambh 2026?",
      answer:
        "Aarambh 2026 has a different theme each day: Open Skies Day (July 14), Bollywood Day (July 15), Canvas Day (July 16), Anime & Toons Day (July 17), Ethnic Day (July 18), Black & White 90s Day (July 19), Fresh and fun day (July 20), and Formal Day (July 21).",
    },
    {
      question: "Who organizes Aarambh 2026?",
      answer:
        "Aarambh 2026 is organized by JKLU's Office of Student Affairs under Head of Student Affairs Mr. Deepak Sogani, with a student organizing committee led by Organizing Heads Vedika Agrawal, Aman Pratap Singh, Vaishnavi Shukla, Tanik Gupta, and Ambika Dalmia.",
    },
    {
      question: "How do I register for Aarambh 2026?",
      answer:
        "Incoming JKLU students register for Aarambh 2026 through the official registration page at aarambh.jklu.edu.in/register.",
    },
  ];

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
