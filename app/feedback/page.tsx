'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { submitFeedback, isFirebaseConfigured, FIREBASE_SETUP_MESSAGE } from '@/lib/db';
import {
  RATING_QUESTIONS,
  OPEN_QUESTIONS,
  type RatingKey,
  type FeedbackRatings,
} from '@/constants/feedback';

const initialRatings: FeedbackRatings = {
  overall: 0,
  engaging: 0,
  relevant: 0,
  duration: 0,
  venue: 0,
};

export default function FeedbackPage() {
  const [ratings, setRatings] = useState<FeedbackRatings>(initialRatings);
  const [likedMost, setLikedMost] = useState('');
  const [improvements, setImprovements] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const firebaseReady = isFirebaseConfigured();

  const setRating = (key: RatingKey, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const allRatingsSelected = RATING_QUESTIONS.every((q) => ratings[q.key] >= 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!allRatingsSelected) {
      setError('Please rate all questions on the 1–5 scale before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({
        ratings,
        likedMost: likedMost.trim(),
        improvements: improvements.trim(),
        suggestions: suggestions.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-24 px-6 max-w-2xl mx-auto min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center w-full"
        >
          <CheckCircle size={64} className="text-brand-orange mx-auto mb-6" />
          <h1 className="text-3xl font-display font-extrabold mb-4 text-brand-cloud">Thank you!</h1>
          <p className="text-brand-cloud/60 text-lg mb-8">
            Your feedback helps us make Aarambh 2026 even better for everyone.
          </p>
          <Button
            variant="glass"
            onClick={() => {
              setSubmitted(false);
              setRatings(initialRatings);
              setLikedMost('');
              setImprovements('');
              setSuggestions('');
            }}
          >
            Submit another response
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-28 px-6 max-w-3xl mx-auto min-h-screen relative">
      <div className="hero-glow w-80 h-80 bg-brand-pink/10 top-0 right-0" />
      <header className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 text-brand-pink mb-4">
          <MessageSquare size={24} />
          <span className="text-sm font-bold uppercase tracking-[0.2em]">Event Feedback</span>
        </div>
        <h1 className="page-title mb-4">
          Share Your Experience
        </h1>
        <p className="page-subtitle mx-auto">
          Tell us how the session went. Your honest feedback shapes future Aarambh events.
        </p>
      </header>

      {!firebaseReady && (
        <div
          className="mb-8 p-4 rounded-xl border border-brand-orange/40 bg-brand-orange/10 text-brand-orange text-sm"
          role="alert"
        >
          {FIREBASE_SETUP_MESSAGE}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <section>
          <h2 className="text-2xl font-display font-bold text-brand-cloud mb-2">Rating questions</h2>
          <p className="text-brand-cloud/50 text-sm mb-6">Select a score from 1 (lowest) to 5 (highest).</p>
          <div className="space-y-6">
            {RATING_QUESTIONS.map((q) => (
              <Card key={q.key} className="p-6">
                <p className="text-brand-cloud font-medium mb-4">{q.label}</p>
                <StarRating
                  value={ratings[q.key]}
                  onChange={(v) => setRating(q.key, v)}
                />
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-brand-cloud mb-2">Open-ended questions</h2>
          <p className="text-brand-cloud/50 text-sm mb-6">Optional, but greatly appreciated.</p>
          <div className="space-y-6">
            {OPEN_QUESTIONS.map((q) => {
              const value =
                q.key === 'likedMost'
                  ? likedMost
                  : q.key === 'improvements'
                    ? improvements
                    : suggestions;
              const setValue =
                q.key === 'likedMost'
                  ? setLikedMost
                  : q.key === 'improvements'
                    ? setImprovements
                    : setSuggestions;

              return (
                <Card key={q.key} className="p-6">
                  <label htmlFor={q.key} className="block text-brand-cloud font-medium mb-3">
                    {q.label}
                  </label>
                  <textarea
                    id={q.key}
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="input-field w-full resize-y min-h-[88px]"
                    placeholder="Your thoughts..."
                  />
                </Card>
              );
            })}
          </div>
        </section>

        {error && (
          <p className="text-red-400 text-sm text-center" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-center pt-4">
          <Button type="submit" disabled={submitting || !firebaseReady} className="px-12 py-3 text-lg">
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex gap-1" role="group" aria-label="Rating 1 to 5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink rounded"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            aria-pressed={value === n}
          >
            <Star
              size={32}
              className={
                n <= display
                  ? 'text-brand-orange fill-brand-orange'
                  : 'text-brand-cloud/25'
              }
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-brand-cloud/50 ml-2 tabular-nums">
        {display > 0 ? `${display} / 5` : 'Not rated'}
      </span>
    </div>
  );
}
