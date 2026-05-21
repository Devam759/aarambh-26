import React from 'react';
import { Users } from 'lucide-react';
import { SPEAKERS_DATA } from '@/constants/speakers';
import { Card } from '@/components/ui/Card';

export default function SpeakersPage() {
  return (
    <div className="py-28 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="hero-glow w-96 h-96 bg-brand-pink/15 -top-10 right-0" />

      <header className="text-center mb-20 relative z-10">
        <span className="page-eyebrow">Meet the Minds</span>
        <h1 className="page-title mb-4">Distinguished Speakers</h1>
        <p className="page-subtitle mx-auto">
          Learn from the visionaries shaping our future.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {SPEAKERS_DATA.map((speaker, idx) => (
          <SpeakerCard key={speaker.name} {...speaker} accentIndex={idx % 3} />
        ))}
      </div>
    </div>
  );
}

const ringColors = [
  'group-hover:border-brand-orange group-hover:shadow-brand-orange',
  'group-hover:border-brand-pink group-hover:shadow-brand-pink',
  'group-hover:border-brand-blue group-hover:shadow-brand-blue',
];
const iconColors = [
  'group-hover:text-brand-orange',
  'group-hover:text-brand-pink',
  'group-hover:text-brand-blue',
];

function SpeakerCard({
  name,
  role,
  accentIndex,
}: {
  name: string;
  role: string;
  accentIndex: number;
}) {
  return (
    <Card
      className={`p-10 flex flex-col items-center text-center group transition-all duration-500 hover:scale-[1.02] ${ringColors[accentIndex]}`}
    >
      <div
        className={`w-32 h-32 rounded-full bg-brand-cloud/5 mb-8 overflow-hidden flex items-center justify-center border-2 border-brand-cloud/15 transition-all duration-300 ${ringColors[accentIndex]}`}
      >
        <Users className={`text-brand-cloud/30 transition-colors ${iconColors[accentIndex]}`} size={56} />
      </div>
      <h4 className="text-2xl font-display font-bold mb-2 text-brand-cloud">{name}</h4>
      <p className="text-sm text-brand-pink uppercase tracking-widest font-semibold">{role}</p>
    </Card>
  );
}
