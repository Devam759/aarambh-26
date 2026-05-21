import React from 'react';
import { FAQS_DATA } from '@/constants/faqs';
import { Card } from '@/components/ui/Card';

export default function FAQPage() {
  return (
    <div className="py-28 px-6 max-w-4xl mx-auto min-h-screen relative">
      <div className="hero-glow w-72 h-72 bg-brand-orange/15 top-0 left-1/2 -translate-x-1/2" />

      <header className="text-center mb-20 relative z-10">
        <span className="page-eyebrow">Got Questions?</span>
        <h1 className="page-title mb-4">FAQ</h1>
        <p className="page-subtitle mx-auto">
          Everything you need to know about AARAMBH&apos;26.
        </p>
      </header>

      <div className="space-y-5 relative z-10">
        {FAQS_DATA.map((faq, index) => (
          <FAQItem key={index} {...faq} index={index} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const accents = ['border-l-brand-orange', 'border-l-brand-pink', 'border-l-brand-blue'];
  return (
    <Card className={`p-8 border-l-4 ${accents[index % 3]}`}>
      <h4 className="text-xl font-display font-bold mb-4 text-brand-cloud">{question}</h4>
      <p className="text-brand-cloud/60 text-lg leading-relaxed">{answer}</p>
    </Card>
  );
}
