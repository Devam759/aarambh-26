'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, Smile, MessageSquare, Filter } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Feedback & Analytics</h1>
          <p className="text-gray-400">Measure the impact of Aarambh 2026</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={20} /> Export CSV
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KPICard title="Total Feedback" value="842" trend="+12%" icon={<MessageSquare className="text-primary" />} />
        <KPICard title="Avg. Rating" value="4.8/5" trend="+0.2" icon={<Smile className="text-secondary" />} />
        <KPICard title="Participation" value="88%" trend="+5%" icon={<TrendingUp className="text-orange-500" />} />
        <KPICard title="NPS Score" value="74" trend="+8" icon={<Smile className="text-blue-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sentiment Analysis Chart Placeholder */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Event-wise Satisfaction</h3>
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-white">
              <Filter size={16} /> Filter
            </button>
          </div>
          <div className="space-y-8">
            <SatisfactionBar label="Tech Expo" value={95} color="bg-secondary" />
            <SatisfactionBar label="Cultural Night" value={88} color="bg-primary" />
            <SatisfactionBar label="RoboWars" value={92} color="bg-orange-500" />
            <SatisfactionBar label="Gaming Summit" value={78} color="bg-blue-500" />
          </div>
        </div>

        {/* Recent Feedback Feed */}
        <div className="glass-card p-6 overflow-hidden">
          <h3 className="text-xl font-bold mb-6">Recent Responses</h3>
          <div className="space-y-6">
            <FeedbackItem 
              name="Anonymous" 
              rating={5} 
              comment="The registration process was so smooth! Great job." 
              time="10m ago"
            />
            <FeedbackItem 
              name="Sarah J." 
              rating={4} 
              comment="Amazing speakers, but the main hall was a bit crowded." 
              time="45m ago"
            />
            <FeedbackItem 
              name="Mike Ross" 
              rating={5} 
              comment="Best university event I've attended in years." 
              time="1h ago"
            />
          </div>
          <button className="w-full mt-8 py-3 text-sm text-primary font-bold hover:bg-white/5 rounded-lg transition-colors">
            View All Responses
          </button>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactElement;
}

function KPICard({ title, value, trend, icon }: KPICardProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
        <span className="text-xs font-bold text-secondary">{trend}</span>
      </div>
      <div>
        <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h4>
        <p className="text-3xl font-black">{value}</p>
      </div>
    </div>
  );
}

interface SatisfactionBarProps {
  label: string;
  value: number;
  color: string;
}

function SatisfactionBar({ label, value, color }: SatisfactionBarProps) {
  return (
    <div>
      <div className="flex justify-between mb-2 text-sm font-medium">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
        />
      </div>
    </div>
  );
}

interface FeedbackItemProps {
  name: string;
  rating: number;
  comment: string;
  time: string;
}

function FeedbackItem({ name, rating, comment, time }: FeedbackItemProps) {
  return (
    <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-sm">{name}</span>
        <span className="text-[10px] text-gray-500 uppercase">{time}</span>
      </div>
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Smile key={i} size={12} className={i < rating ? "text-secondary" : "text-gray-700"} />
        ))}
      </div>
      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">"{comment}"</p>
    </div>
  );
}
