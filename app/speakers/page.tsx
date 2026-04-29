import React from 'react';
import { Users } from 'lucide-react';
import { SPEAKERS_DATA } from '@/constants/speakers';
import { Card } from '@/components/ui/Card';

export default function SpeakersPage() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
      <header className="text-center mb-20">
        <h1 className="text-6xl font-black mb-4 text-white">Distinguished Speakers</h1>
        <p className="text-gray-400 text-xl font-medium">Learn from the visionaries shaping our future.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SPEAKERS_DATA.map((speaker) => (
          <SpeakerCard key={speaker.name} {...speaker} />
        ))}
      </div>
    </div>
  );
}

function SpeakerCard({ name, role }: { name: string; role: string }) {
  return (
    <Card className="p-10 flex flex-col items-center text-center group hover:border-primary/50 transition-all duration-500">
      <div className="w-32 h-32 rounded-full bg-white/5 mb-8 overflow-hidden flex items-center justify-center border border-white/10 group-hover:border-primary transition-all duration-300">
        <Users className="text-gray-600 group-hover:text-primary transition-colors" size={56} />
      </div>
      <h4 className="text-2xl font-bold mb-2 text-white">{name}</h4>
      <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">{role}</p>
    </Card>
  );
}

