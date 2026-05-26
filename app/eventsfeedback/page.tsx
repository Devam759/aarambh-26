'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { SCHEDULE_DATA } from '@/constants/events';

// ============================================================================
// BESPOKE CUSTOM GEOMETRIC SVG ICONS (Gradient-free, Sharp, Heavy-mitre)
// ============================================================================

const CustomStarIcon = ({ className = '', size = 24, filled = false }: { className?: string; size?: number; filled?: boolean }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={filled ? "var(--color-brand-orange)" : "none"} 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CustomCheckIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3.2" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CustomWarningIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
    <line x1="12" y1="8" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CustomLoaderIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3.2" 
    strokeLinecap="square" 
    className={`animate-spin ${className}`}
  >
    <path d="M12 2A10 10 0 0 1 22 12" />
  </svg>
);

const CustomMessageIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// ============================================================================
// DEFAULT QUESTIONS SEED GENERATOR
// ============================================================================
export function generateDefaultFormsMap(): Record<string, { questions: any[] }> {
  const forms: Record<string, { questions: any[] }> = {};
  
  SCHEDULE_DATA.forEach((daySchedule) => {
    const questions: any[] = [];
    let qCount = 1;
    
    // Add rating question for each non-meal event
    daySchedule.events.forEach((evt) => {
      const t = evt.title.toUpperCase();
      if (t === 'BREAKFAST' || t === 'LUNCH' || t === 'SNACKS' || t === 'DINNER' || t === 'REST') {
        return;
      }
      
      questions.push({
        id: `q_${daySchedule.day.replace(' ', '_').toLowerCase()}_rating_${qCount++}`,
        type: 'rating',
        label: evt.title,
        required: false
      });
    });
    
    // Add 3 default text questions
    questions.push({
      id: `q_${daySchedule.day.replace(' ', '_').toLowerCase()}_text_1`,
      type: 'text',
      label: "What did you like most about today's events?",
      required: false
    });
    questions.push({
      id: `q_${daySchedule.day.replace(' ', '_').toLowerCase()}_text_2`,
      type: 'text',
      label: "What should be improved tomorrow / next time?",
      required: false
    });
    questions.push({
      id: `q_${daySchedule.day.replace(' ', '_').toLowerCase()}_text_3`,
      type: 'text',
      label: "Any other suggestions for future squad sessions?",
      required: false
    });
    
    forms[daySchedule.day] = { questions };
  });
  
  return forms;
}

export default function AnonymousFeedbackSubmitPage() {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const activeDay = SCHEDULE_DATA[selectedDayIdx];

  // Dynamic Form states
  const [formsMap, setFormsMap] = useState<Record<string, { questions: any[] }>>({});
  const [answersState, setAnswersState] = useState<Record<string, { value?: any; comment?: string }>>({});
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(true);

  const firebaseReady = isFirebaseConfigured();

  // Load dynamic configurations from Firestore settings
  useEffect(() => {
    if (!firebaseReady || !db) {
      // Seed fallback offline map
      setFormsMap(generateDefaultFormsMap());
      setLoadingSettings(false);
      return;
    }
    async function loadSettings() {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'feedback'));
        let activeDayIdx = 0;
        let dbForms: Record<string, any> = {};

        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          const activeDayId = data.activeDayId || 'Day 01';
          const dayIdx = SCHEDULE_DATA.findIndex(d => d.day === activeDayId);
          if (dayIdx !== -1) activeDayIdx = dayIdx;
          dbForms = data.forms || {};
        }

        // Seed defaults if missing
        const seededForms = generateDefaultFormsMap();
        const combinedForms: Record<string, any> = {};
        SCHEDULE_DATA.forEach((daySchedule) => {
          combinedForms[daySchedule.day] = dbForms[daySchedule.day] || seededForms[daySchedule.day];
        });

        setSelectedDayIdx(activeDayIdx);
        setFormsMap(combinedForms);
      } catch (err) {
        console.error('Error loading feedback settings:', err);
        setFormsMap(generateDefaultFormsMap());
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, [firebaseReady]);

  // Compute active question list based on selected tab day
  const activeQuestions = useMemo(() => {
    return formsMap[activeDay.day]?.questions || [];
  }, [formsMap, activeDay]);

  const handleRatingChange = (qId: string, val: number) => {
    setAnswersState(prev => ({
      ...prev,
      [qId]: { ...prev[qId], value: val }
    }));
  };

  const handleRatingCommentChange = (qId: string, comment: string) => {
    setAnswersState(prev => ({
      ...prev,
      [qId]: { ...prev[qId], comment }
    }));
  };

  const handleTextValueChange = (qId: string, text: string) => {
    setAnswersState(prev => ({
      ...prev,
      [qId]: { ...prev[qId], value: text }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Compile dynamic responses to submit
    const answersToSubmit: Record<string, any> = {};
    let hasSubmissions = false;

    activeQuestions.forEach((q) => {
      const state = answersState[q.id];
      if (q.type === 'rating') {
        const val = state?.value || 0;
        if (val > 0) {
          answersToSubmit[q.id] = {
            type: 'rating',
            label: q.label,
            value: val,
            comment: state?.comment || ''
          };
          hasSubmissions = true;
        }
      } else if (q.type === 'text') {
        const val = (state?.value || '').trim();
        if (val) {
          answersToSubmit[q.id] = {
            type: 'text',
            label: q.label,
            value: val,
            comment: ''
          };
          hasSubmissions = true;
        }
      }
    });

    if (!hasSubmissions) {
      setError('Please answer at least one question before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        day: activeDay.day,
        date: activeDay.date,
        anonymous: true,
        submittedAt: serverTimestamp(),
        answers: answersToSubmit
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSettings) {
    return (
      <div className="min-h-screen bg-brand-cloud flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(#030404_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        <div className="text-center space-y-4 z-10">
          <CustomLoaderIcon className="text-brand-ink mx-auto" size={48} />
          <p className="text-brand-ink/50 text-xs font-black uppercase tracking-widest animate-pulse">
            Loading Feedback Form...
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-cloud flex items-center justify-center p-4 md:p-8 font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(#030404_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        
        <div className="w-full max-w-[540px] z-10 text-center">
          <div className="bg-white border-4 border-brand-ink p-8 md:p-12 shadow-[8px_8px_0px_0px_#030404] rounded-lg animate-fade-in">
            <div className="inline-flex items-center justify-center p-4 border-4 border-brand-ink bg-brand-orange shadow-[4px_4px_0px_0px_#030404] rounded-md mb-8">
              <CustomCheckIcon size={44} className="text-brand-ink" />
            </div>
            
            <h1 className="text-3xl font-display font-black tracking-wider uppercase text-brand-ink mb-4">
              Feedback Sent
            </h1>
            
            <p className="text-brand-ink/75 font-bold text-sm md:text-base leading-relaxed mb-8">
              Thank you! Your feedback for <strong>{activeDay.day}</strong> has been logged completely anonymously. Your insights will directly help us shape Aarambh events.
            </p>
            
            <button
              onClick={() => {
                setSubmitted(false);
                setAnswersState({});
              }}
              className="px-8 py-3 bg-brand-pink hover:bg-primary-dark text-white font-black border-2 border-brand-ink shadow-[4px_4px_0px_0px_#030404] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#030404] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 flex justify-center items-center gap-2 mx-auto cursor-pointer rounded-md uppercase tracking-wider text-xs"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cloud p-4 md:p-8 font-sans relative pb-20 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(#030404_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
      
      <div className="w-full max-w-3xl mx-auto z-10 relative mt-4 md:mt-8">
        
        {/* Banner Block */}
        <div className="bg-white border-4 border-brand-ink p-8 shadow-[8px_8px_0px_0px_#030404] rounded-lg mb-8 text-center md:text-left">
          <div className="space-y-3">
            <h1 className="text-3xl font-display font-black tracking-tight uppercase text-brand-ink">
              Event Feedback Portal
            </h1>
            <p className="text-brand-ink/65 text-xs md:text-sm font-bold leading-relaxed">
              No logins, no emails, no names. Complete the customized evaluation for the sessions you attended today.
            </p>
          </div>
        </div>

        {/* Dynamic Horizontal Neo-Brutalist Days Selector */}
        <div className="mb-10 space-y-2">
          <span className="block text-[10px] font-black uppercase text-brand-ink/60 tracking-wider">
            Select Today's Day
          </span>
          <div className="flex overflow-x-auto gap-3 pb-3 scrollbar-thin">
            {SCHEDULE_DATA.map((day, idx) => {
              const isActive = selectedDayIdx === idx;
              return (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => {
                    setSelectedDayIdx(idx);
                    setAnswersState({});
                  }}
                  className={`comic-interactive border-2 shrink-0 py-2.5 px-5 font-display text-xs font-black uppercase tracking-wider transition-all rounded-md cursor-pointer ${
                    isActive
                      ? 'bg-brand-pink text-white border-brand-ink shadow-[3px_3px_0px_0px_#030404] translate-x-[-1px] translate-y-[-1px]'
                      : 'bg-white text-brand-ink/65 border-brand-ink shadow-comic-sm hover:bg-brand-orange hover:text-brand-ink'
                  }`}
                >
                  <div>{day.day}</div>
                  <div className="text-[9px] font-mono opacity-80 mt-0.5">{day.date}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Submission */}
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* STEP 2: DYNAMIC QUESTIONS LIST */}
          <section className="space-y-6">
            <div className="border-b-4 border-brand-ink pb-2 mb-4">
              <h2 className="text-lg font-display font-black uppercase text-brand-ink">
                Complete the Evaluation Form ({activeDay.day})
              </h2>
              <p className="text-brand-ink/50 text-[10px] uppercase font-black tracking-wider">
                Please evaluate the sessions and provide your honest feedback
              </p>
            </div>

            <div className="space-y-6">
              {activeQuestions.map((q) => {
                if (q.type === 'rating') {
                  const currentRating = answersState[q.id]?.value || 0;
                  const currentComment = answersState[q.id]?.comment || '';
                  
                  return (
                    <div 
                      key={q.id} 
                      className="bg-white border-4 border-brand-ink p-5 md:p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-brand-ink/10 pb-4">
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-tight text-brand-ink">
                            {q.label}
                          </h3>
                        </div>
                        
                        {/* Interactive Stars Selector */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex gap-1" role="group" aria-label={`Rate ${q.label}`}>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => handleRatingChange(q.id, n)}
                                className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                                aria-label={`${n} stars`}
                                aria-pressed={currentRating === n}
                              >
                                <CustomStarIcon
                                  size={28}
                                  filled={n <= currentRating}
                                  className={n <= currentRating ? 'text-brand-ink' : 'text-brand-ink/15'}
                                />
                              </button>
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-brand-ink/50 w-20 text-center uppercase tracking-wider">
                            {currentRating > 0 ? `${currentRating} / 5` : 'Not Rated'}
                          </span>
                        </div>
                      </div>

                      {/* Dynamic rating optional comment field */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-black uppercase tracking-wider text-brand-ink/50">
                          Optional comment for this session
                        </label>
                        <input
                          type="text"
                          value={currentComment}
                          onChange={(e) => handleRatingCommentChange(q.id, e.target.value)}
                          className="w-full bg-white border-2 border-brand-ink rounded-md py-2.5 px-4 focus:outline-none focus:border-brand-pink text-xs text-brand-ink font-bold placeholder:text-brand-ink/30 transition-colors shadow-inner"
                          placeholder="What went well or what could be improved?"
                        />
                      </div>
                    </div>
                  );
                } else {
                  // Paragraph Text Input
                  const textValue = answersState[q.id]?.value || '';
                  
                  return (
                    <div 
                      key={q.id} 
                      className="bg-white border-4 border-brand-ink p-5 md:p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg space-y-2"
                    >
                      <label className="block text-[10px] font-black uppercase tracking-wider text-brand-ink/70">
                        {q.label}
                      </label>
                      <textarea
                        rows={3}
                        value={textValue}
                        onChange={(e) => handleTextValueChange(q.id, e.target.value)}
                        className="w-full bg-white border-2 border-brand-ink rounded-md py-3 px-4 focus:outline-none focus:border-brand-pink text-sm text-brand-ink font-bold placeholder:text-brand-ink/30 transition-colors shadow-inner resize-y min-h-[80px]"
                        placeholder="Your response..."
                      />
                    </div>
                  );
                }
              })}
            </div>
          </section>

          {/* Warnings and errors */}
          {error && (
            <div className="p-3 bg-brand-pink/15 text-brand-ink text-xs font-bold border-2 border-brand-ink rounded-md flex gap-2 items-center justify-center shadow-comic-sm max-w-md mx-auto">
              <CustomWarningIcon className="text-brand-pink shrink-0" size={16} />
              <span className="uppercase tracking-wide">{error}</span>
            </div>
          )}

          {/* Submission Trigger */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={submitting || !firebaseReady}
              className="px-12 py-4 bg-brand-pink hover:bg-primary-dark text-white font-black border-4 border-brand-ink shadow-[6px_6px_0px_0px_#030404] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#030404] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-md uppercase tracking-widest text-xs"
            >
              {submitting ? (
                <>
                  <CustomLoaderIcon size={16} className="text-white" />
                  <span>Registering Feedback...</span>
                </>
              ) : (
                <>
                  <CustomCheckIcon size={16} className="text-white" />
                  <span>Submit Anonymous Form</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Page Footer */}
        <p className="mt-12 text-center text-brand-ink/40 text-[9px] uppercase font-black tracking-[0.2em]">
          JK Lakshmipat University • Aarambh '26
        </p>
      </div>
    </div>
  );
}
