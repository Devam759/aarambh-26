'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, PieChart, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-03-15T09:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
        secs: Math.floor((difference / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 text-center max-w-4xl"
        >
          <span className="text-primary font-bold tracking-widest uppercase mb-4 block">University of Excellence Presents</span>
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-secondary">
            AARAMBH 2026
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            The ultimate convergence of technology, culture, and innovation. 
            Join us for a 3-day extravaganza that defines the future.
          </p>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            {(['Days', 'Hours', 'Mins', 'Secs'] as const).map((label) => (
              <Card key={label} className="p-4 flex flex-col items-center min-w-[80px]">
                <span className="text-3xl font-bold">{timeLeft[label.toLowerCase() as keyof TimeLeft]}</span>
                <span className="text-xs text-gray-500 uppercase">{label}</span>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button className="flex items-center gap-2">
              Register Now <ArrowRight size={20} />
            </Button>
            <Link href="/check-in">
              <Button variant="glass" className="flex items-center gap-2">
                Volunteer Access
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 px-4 w-full max-w-7xl">
        <h2 className="text-3xl font-bold mb-12 text-center uppercase tracking-widest text-white">Platform Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ModuleCard 
            title="Digital Check-in" 
            desc="Seamless entry with QR verification for participants."
            icon={<ShieldCheck className="text-primary" />}
            link="/check-in"
          />
          <ModuleCard 
            title="Volunteer Portal" 
            desc="Coordinate tasks, roles, and duty rosters in real-time."
            icon={<Users className="text-secondary" />}
            link="/volunteer"
          />
          <ModuleCard 
            title="Feedback & Analytics" 
            desc="Post-event insights and real-time satisfaction tracking."
            icon={<PieChart className="text-orange-500" />}
            link="/admin"
          />
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="py-32 px-6 w-full max-w-5xl pb-60">
        <Card className="p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <h2 className="text-4xl font-bold mb-6 relative z-10 text-white">Don't Miss Any Update</h2>
          <p className="text-gray-400 mb-10 relative z-10 max-w-lg mx-auto">
            Subscribe to our newsletter to get real-time alerts about registrations, speaker announcements, and event highlights.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="input-field flex-grow py-3"
              required
            />
            <Button className="py-3 px-8">Subscribe</Button>
          </form>
        </Card>
      </section>
    </main>
  );
}

interface ModuleCardProps {
  title: string;
  desc: string;
  icon: React.ReactElement;
  link: string;
}

function ModuleCard({ title, desc, icon, link }: ModuleCardProps) {
  return (
    <Link href={link}>
      <Card 
        className="p-8 h-full flex flex-col items-start gap-4 cursor-pointer hover:border-primary/50 transition-colors group"
      >
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors"
        >
          {React.cloneElement(icon, { size: 32 } as any)}
        </motion.div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
      </Card>
    </Link>
  );
}
