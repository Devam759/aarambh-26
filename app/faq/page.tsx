import React from 'react';
import { FAQS_DATA } from '@/constants/faqs';
import { Card } from '@/components/ui/Card';

export default function FAQPage() {
  return (
    <div className="py-24 px-6 max-w-4xl mx-auto min-h-screen">
      <header className="text-center mb-20">
        <h1 className="text-6xl font-black mb-4 uppercase tracking-wider text-white">FAQ</h1>
        <p className="text-gray-400 text-xl font-medium">Everything you need to know about Aarambh 2026.</p>
      </header>

      <div className="space-y-6">
        {FAQS_DATA.map((faq, index) => (
          <FAQItem key={index} {...faq} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <Card className="p-8">
      <h4 className="text-xl font-bold mb-4 text-white">{question}</h4>
      <p className="text-gray-400 text-lg leading-relaxed">{answer}</p>
    </Card>
  );
}

