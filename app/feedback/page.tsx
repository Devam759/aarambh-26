'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, onSnapshot, serverTimestamp, addDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { SCHEDULE_DATA } from '@/constants/events';

// ============================================================================
// CUSTOM GEOMETRIC SVG ICONS (Gradient-free, Sharp, Heavy-mitre)
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

const COHORTS = [
  "A1", "A2", "A3", "A4", "A5",
  "B1", "B2", "B3", "B4",
  "C1", "C2", "C3", "C4",
  "D1", "D2", "D3", "D4", "D5",
  "E1", "E2", "E3", "E4", "E5",
  "F1", "F2", "F3", "F4", "F5",
  "G1", "G2", "G3", "G4", "G5",
  "H1", "H2", "H3", "H4", "H5",
  "I1", "I2", "I3",
  "J1", "J2", "J3",
  "K1", "K2", "K3",
  "L1", "L2", "L3"
];

export default function StudentFeedbackPage() {
  const router = useRouter();

  // Student active portal states
  const [showSetupModal, setShowSetupModal] = useState(true);
  const [submissionType, setSubmissionType] = useState<'anonymous' | 'named'>('anonymous');
  const [studentName, setStudentName] = useState('');
  const [studentCohort, setStudentCohort] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [modalError, setModalError] = useState('');

  const [studentActiveDayId, setStudentActiveDayId] = useState('Day 01');
  const [studentActiveDayDate, setStudentActiveDayDate] = useState('');
  const [loadingActiveDay, setLoadingActiveDay] = useState(true);

  // Dynamic Questions and answers state
  const [batchForms, setBatchForms] = useState<Record<string, any[]>>({});
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(true);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, any>>({});
  const [studentSubmitting, setStudentSubmitting] = useState(false);
  const [studentSubmitted, setStudentSubmitted] = useState(false);
  const [studentFormError, setStudentFormError] = useState('');

  const firebaseReady = isFirebaseConfigured();

  const activeQuestions = batchForms[`${studentActiveDayId}_Batch ${selectedBatch}`] || batchForms[`Batch ${selectedBatch}`] || [];

  // Load active day and questions for student view
  useEffect(() => {
    if (!firebaseReady || !db) {
      setLoadingActiveDay(false);
      return;
    }
    const unsubscribe = onSnapshot(doc(db, 'settings', 'feedback'), (settingsDoc) => {
      try {
        let dbBatchForms: Record<string, any[]> = {};
        let dayId = 'Day 01';
        let dbFormOpen = true;

        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          dayId = data.activeDayId || 'Day 01';
          dbBatchForms = data.batchForms || {};
          dbFormOpen = data.isFormOpen !== undefined ? data.isFormOpen : true;
        }

        setStudentActiveDayId(dayId);
        setIsStudentFormOpen(dbFormOpen);
        const dayData = SCHEDULE_DATA.find(d => d.day === dayId);
        if (dayData) {
          setStudentActiveDayDate(dayData.date);
        }
        
        const seededBatches: Record<string, any[]> = { ...dbBatchForms };
        ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4'].forEach((batch) => {
          const suffix = batch.toLowerCase().replace(' ', '_');
          if (!seededBatches[batch]) {
            seededBatches[batch] = [
              { id: `q_${suffix}_rating_1`, type: 'rating', label: 'How would you rate your day overall?', required: true },
              { id: `q_${suffix}_mcq_1`, type: 'mcq', label: "How was the day's pace?", options: ['Too Fast', 'Just Right', 'Too Slow'], required: true },
              { id: `q_${suffix}_mcq_2`, type: 'mcq', label: 'Did you feel engaged throughout the day?', options: ['Yes', 'Partially', 'No'], required: true },
              { id: `q_${suffix}_rating_2`, type: 'rating', label: "How relevant and valuable were today's activities for you?", required: true },
              { id: `q_${suffix}_rating_3`, type: 'rating', label: 'How clearly was information communicated throughout the day?', required: true },
              { id: `q_${suffix}_rating_4`, type: 'rating', label: "How comfortable were today's arrangements?", required: true },
              { id: `q_${suffix}_rating_5`, type: 'rating', label: 'How supported did you feel by your Cohort Leader / OH Team today?', required: true },
              { id: `q_${suffix}_text_1`, type: 'text', label: 'What was the highlight of your day?', required: false },
              { id: `q_${suffix}_text_2`, type: 'text', label: 'What could have been better today?', required: false },
              { id: `q_${suffix}_mcq_3`, type: 'mcq', label: 'What was your energy level at the end of the day?', options: ['😴 Exhausted', '😐 Okay', '😃 Pumped Up'], required: true }
            ];
          }
        });
        setBatchForms(seededBatches);
      } catch (err) {
        console.error('Error loading active day settings:', err);
      } finally {
        setLoadingActiveDay(false);
      }
    }, (err) => {
      console.error('Settings snapshot error:', err);
      setLoadingActiveDay(false);
    });

    return () => unsubscribe();
  }, [firebaseReady]);

  const handleStudentRatingChange = (key: string, val: number) => {
    setStudentAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleStudentTextChange = (key: string, val: string) => {
    setStudentAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentFormError('');

    // Form Validation: Ensure overall rating is filled if present
    const overallRatingQ = activeQuestions.find(q => q.label.toLowerCase().includes('overall'));
    if (overallRatingQ && !studentAnswers[overallRatingQ.id]) {
      setStudentFormError('Please rate your day overall.');
      return;
    }

    // Validate all required questions
    for (const q of activeQuestions) {
      if (q.required) {
        const val = studentAnswers[q.id];
        if (q.type === 'rating') {
          if (!val || Number(val) === 0) {
            setStudentFormError(`Please answer the mandatory question: "${q.label}"`);
            return;
          }
        } else {
          if (!val || !String(val).trim()) {
            setStudentFormError(`Please answer the mandatory question: "${q.label}"`);
            return;
          }
        }
      }
    }

    setStudentSubmitting(true);
    try {
      const answersToSubmit: Record<string, any> = {};

      activeQuestions.forEach((q) => {
        const val = studentAnswers[q.id];
        if (q.type === 'rating') {
          answersToSubmit[q.id] = {
            type: 'rating',
            label: q.label,
            value: Number(val || 0),
            comment: ''
          };
        } else if (q.type === 'mcq') {
          answersToSubmit[q.id] = {
            type: 'mcq',
            label: q.label,
            value: String(val || ''),
            comment: ''
          };
        } else {
          answersToSubmit[q.id] = {
            type: 'text',
            label: q.label,
            value: String(val || ''),
            comment: ''
          };
        }
      });

      await addDoc(collection(db, 'feedback'), {
        day: studentActiveDayId,
        date: studentActiveDayDate || '',
        anonymous: submissionType === 'anonymous',
        studentName: submissionType === 'anonymous' ? 'Anonymous' : studentName,
        studentCohort: submissionType === 'anonymous' ? null : studentCohort.trim(),
        batch: `Batch ${selectedBatch}`,
        submittedAt: serverTimestamp(),
        answers: answersToSubmit
      });

      setStudentSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setStudentFormError(err instanceof Error ? err.message : 'Failed to submit feedback. Please try again.');
    } finally {
      setStudentSubmitting(false);
    }
  };

  const handleStartForm = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (submissionType === 'named' && !studentName.trim()) {
      setModalError('Please enter your name.');
      return;
    }
    if (submissionType === 'named' && !studentCohort.trim()) {
      setModalError('Please enter your cohort.');
      return;
    }
    if (!selectedBatch) {
      setModalError('Please select your batch.');
      return;
    }
    setShowSetupModal(false);
  };

  if (loadingActiveDay) {
    return (
      <div className="min-h-screen bg-brand-cloud flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(#030404_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        <div className="text-center space-y-4 z-10">
          <CustomLoaderIcon className="text-brand-ink mx-auto" size={48} />
          <p className="text-brand-ink/50 text-xs font-black uppercase tracking-widest">
            Opening Feedback Form...
          </p>
        </div>
      </div>
    );
  }

  // Rendering the Student Submitted state
  if (studentSubmitted) {
    return (
      <div className="min-h-screen bg-brand-cloud flex items-center justify-center p-4 md:p-8 font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(#030404_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        
        <div className="w-full max-w-[540px] z-10 text-center">
          <div className="bg-white border-4 border-brand-ink p-8 md:p-12 shadow-[8px_8px_0px_0px_#030404] rounded-lg">
            <div className="inline-flex items-center justify-center p-4 border-4 border-brand-ink bg-brand-orange shadow-[4px_4px_0px_0px_#030404] rounded-md mb-8">
              <CustomCheckIcon size={44} className="text-brand-ink" />
            </div>
            
            <h1 className="text-3xl font-display font-black tracking-wider uppercase text-brand-ink mb-4">
              Feedback Sent
            </h1>
            
            <p className="text-brand-ink/75 font-bold text-sm md:text-base leading-relaxed mb-8">
              Thank you! Your feedback for <strong>{studentActiveDayId}</strong> has been logged successfully. Your insights will help us shape Aarambh events.
            </p>
            
            <button
              onClick={() => {
                setStudentSubmitted(false);
                setStudentAnswers({});
                setStudentName('');
                setStudentCohort('');
                setShowSetupModal(true);
              }}
              className="comic-btn-primary mx-auto"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enforce Form Closed check
  if (!isStudentFormOpen) {
    return (
      <div className="min-h-screen bg-brand-cloud flex items-center justify-center p-4 md:p-8 font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(#030404_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        
        <div className="w-full max-w-[540px] z-10 text-center">
          <div className="bg-white border-4 border-brand-ink p-8 md:p-12 shadow-[8px_8px_0px_0px_#030404] rounded-lg animate-fade-in">
            <div className="inline-flex items-center justify-center p-4 border-4 border-brand-ink bg-brand-orange shadow-[4px_4px_0px_0px_#030404] rounded-md mb-8">
              <CustomWarningIcon size={44} className="text-brand-ink" />
            </div>
            
            <h1 className="text-3xl font-display font-black tracking-wider uppercase text-brand-ink mb-4">
              Feedback Closed
            </h1>
            
            <p className="text-brand-ink/75 font-bold text-sm md:text-base leading-relaxed mb-8">
              Feedback submissions are currently closed. No new responses are being accepted at this time.
            </p>
            
            <div className="p-3 bg-brand-orange/10 border-2 border-brand-orange rounded-md text-[10px] md:text-xs font-black uppercase text-brand-orange tracking-wider">
              Please check back later or contact the administrator.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cloud p-4 md:p-8 font-sans relative pb-20 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(#030404_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
      
      {/* SETUP POPUP MODAL */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-[#030404]/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <form onSubmit={handleStartForm} className="bg-white border-4 border-brand-ink p-6 md:p-8 shadow-[8px_8px_0px_0px_#030404] rounded-lg w-full max-w-[500px] space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-black uppercase text-brand-ink">
                Aarambh '26 Feedback
              </h2>
              <p className="text-brand-ink/60 text-xs font-bold uppercase">
                Submit feedback for {studentActiveDayId} ({studentActiveDayDate})
              </p>
            </div>

            {/* Submission Mode selection */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase text-brand-ink/70">
                Identity Option
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSubmissionType('anonymous')}
                  className={`py-3 px-4 border-2 font-display text-xs font-black uppercase tracking-wider rounded-md transition-all cursor-pointer text-center ${
                    submissionType === 'anonymous'
                      ? 'bg-brand-blue text-white border-brand-ink shadow-[3px_3px_0px_0px_#030404] translate-x-[-1px] translate-y-[-1px]'
                      : 'bg-white text-brand-ink/65 border-brand-ink shadow-[3px_3px_0px_0px_#030404] hover:bg-brand-cloud'
                  }`}
                >
                  Anonymous
                </button>
                <button
                  type="button"
                  onClick={() => setSubmissionType('named')}
                  className={`py-3 px-4 border-2 font-display text-xs font-black uppercase tracking-wider rounded-md transition-all cursor-pointer text-center ${
                    submissionType === 'named'
                      ? 'bg-brand-blue text-white border-brand-ink shadow-[3px_3px_0px_0px_#030404] translate-x-[-1px] translate-y-[-1px]'
                      : 'bg-white text-brand-ink/65 border-brand-ink shadow-[3px_3px_0px_0px_#030404] hover:bg-brand-cloud'
                  }`}
                >
                  Enter Name
                </button>
              </div>
            </div>

            {/* Name & Cohort Input Box if Name selected */}
            {submissionType === 'named' && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase text-brand-ink/70">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white border-2 border-brand-ink rounded-md py-2 px-3 text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase text-brand-ink/70">
                    Select Cohort
                  </label>
                  <select
                    value={studentCohort}
                    onChange={(e) => setStudentCohort(e.target.value)}
                    className="w-full bg-white border-2 border-brand-ink rounded-md py-2 px-3 text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-blue"
                    required
                  >
                    <option value="" disabled>Select Cohort</option>
                    {COHORTS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Batch selection */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase text-brand-ink/70">
                Choose your Batch
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['1', '2', '3', '4'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBatch(b)}
                    className={`py-2 px-3 border-2 font-display text-xs font-black rounded-md transition-all cursor-pointer text-center ${
                      selectedBatch === b
                        ? 'bg-brand-blue text-white border-brand-ink shadow-[2px_2px_0px_0px_#030404] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-brand-orange text-brand-ink border-brand-ink shadow-[2px_2px_0px_0px_#030404] hover:bg-brand-orange/80'
                    }`}
                  >
                    Batch {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {modalError && (
              <div className="text-brand-blue text-xs font-bold uppercase text-center">
                {modalError}
              </div>
            )}

            {/* Proceed Button */}
            <button
              type="submit"
              className="w-full comic-btn-primary border-4 shadow-[4px_4px_0px_0px_#030404] py-3 text-center uppercase tracking-widest font-black"
            >
              Proceed to Form
            </button>
          </form>
        </div>
      )}

      {/* FEEDBACK SUBMISSION FORM */}
      <div className="w-full max-w-3xl mx-auto z-10 relative mt-4 md:mt-8">
        
        {/* Banner Card */}
        <div className="bg-white border-4 border-brand-ink p-6 md:p-8 shadow-[8px_8px_0px_0px_#030404] rounded-lg mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase text-brand-ink">
              Feedback Form
            </h1>
            <p className="text-brand-ink/65 text-xs md:text-sm font-bold mt-1">
              Active Day: <span className="text-brand-blue font-black">{studentActiveDayId}</span> ({studentActiveDayDate})
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowSetupModal(true)}
              className="bg-brand-orange/10 border-2 border-brand-orange text-brand-orange font-black uppercase text-[10px] tracking-wider py-1.5 px-3 rounded shadow-comic-sm cursor-pointer hover:bg-brand-orange hover:text-brand-ink hover:border-brand-orange transition-colors"
              title="Click to change batch or identity details"
            >
              Batch {selectedBatch || 'N/A'}
            </button>
            <button
              type="button"
              onClick={() => setShowSetupModal(true)}
              className="bg-brand-blue/10 border-2 border-brand-blue text-brand-blue font-black uppercase text-[10px] tracking-wider py-1.5 px-3 rounded shadow-comic-sm cursor-pointer hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors"
              title="Click to change batch or identity details"
            >
              {submissionType === 'anonymous' ? 'Anonymous Mode' : `${studentName} (${studentCohort})`}
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleStudentSubmit} className="space-y-6">
          
          {/* Dynamic Questionnaire Render */}
          {activeQuestions.map((q, idx) => {
            if (q.type === 'rating') {
              const currentRating = studentAnswers[q.id] || 0;
              return (
                <div key={q.id} className="bg-white border-4 border-brand-ink p-5 md:p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-brand-ink/10 pb-3">
                    <h3 className="text-sm md:text-base font-black uppercase text-brand-ink">
                      {idx + 1}. {q.label} {q.required && <span className="text-brand-blue font-black">*</span>}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => handleStudentRatingChange(q.id, stars)}
                        className="p-1 transition-transform hover:scale-110 cursor-pointer"
                      >
                        <CustomStarIcon
                          size={32}
                          filled={stars <= currentRating}
                          className={stars <= currentRating ? 'text-brand-orange' : 'text-brand-ink/15'}
                        />
                      </button>
                    ))}
                    <span className="text-[11px] font-black text-brand-ink uppercase ml-4">
                      {currentRating ? `${currentRating} / 5` : 'Rate'}
                    </span>
                  </div>
                </div>
              );
            } else if (q.type === 'mcq') {
              const selectedValue = studentAnswers[q.id] || '';
              return (
                <div key={q.id} className="bg-white border-4 border-brand-ink p-5 md:p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg space-y-4">
                  <h3 className="text-sm md:text-base font-black uppercase text-brand-ink border-b-2 border-brand-ink/10 pb-3">
                    {idx + 1}. {q.label} {q.required && <span className="text-brand-blue font-black">*</span>}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(q.options || []).map((opt: string) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleStudentTextChange(q.id, opt)}
                        className={`py-3 px-4 border-2 font-display text-xs font-black rounded-md transition-all cursor-pointer text-left ${
                          selectedValue === opt
                            ? 'bg-brand-blue text-white border-brand-ink shadow-[2px_2px_0px_0px_#030404] translate-x-[-1px] translate-y-[-1px]'
                            : 'bg-white text-brand-ink/65 border-brand-ink shadow-[2px_2px_0px_0px_#030404] hover:bg-brand-cloud'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            } else if (q.type === 'date') {
              const dateValue = studentAnswers[q.id] || '';
              return (
                <div key={q.id} className="bg-white border-4 border-brand-ink p-5 md:p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg space-y-2">
                  <h3 className="text-sm md:text-base font-black uppercase text-brand-ink border-b-2 border-brand-ink/10 pb-3">
                    {idx + 1}. {q.label} {q.required && <span className="text-brand-blue font-black">*</span>}
                  </h3>
                  <input
                    type="date"
                    value={dateValue}
                    onChange={(e) => handleStudentTextChange(q.id, e.target.value)}
                    className="w-full bg-white border-2 border-brand-ink rounded-md py-3 px-4 focus:outline-none focus:border-brand-blue text-sm text-brand-ink font-black transition-colors shadow-inner"
                  />
                </div>
              );
            } else {
              const textValue = studentAnswers[q.id] || '';
              return (
                <div key={q.id} className="bg-white border-4 border-brand-ink p-5 md:p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg space-y-2">
                  <h3 className="text-sm md:text-base font-black uppercase text-brand-ink border-b-2 border-brand-ink/10 pb-3">
                    {idx + 1}. {q.label} {q.required && <span className="text-brand-blue font-black">*</span>}
                  </h3>
                  <textarea
                    rows={3}
                    value={textValue}
                    onChange={(e) => handleStudentTextChange(q.id, e.target.value)}
                    className="w-full bg-white border-2 border-brand-ink rounded-md py-3 px-4 focus:outline-none focus:border-brand-blue text-sm text-brand-ink font-black placeholder:text-brand-ink/30 transition-colors shadow-inner resize-y min-h-[80px]"
                    placeholder="Your response..."
                  />
                </div>
              );
            }
          })}

          {/* Validation errors */}
          {studentFormError && (
            <div className="p-3 bg-brand-blue/15 text-brand-ink text-xs font-bold border-2 border-brand-ink rounded-md flex gap-2 items-center justify-center shadow-comic-sm max-w-md mx-auto">
              <CustomWarningIcon className="text-brand-blue/80 shrink-0" size={16} />
              <span className="uppercase tracking-wide">{studentFormError}</span>
            </div>
          )}

          {/* Submit Trigger */}
          <div className="pt-4 flex flex-col items-center gap-4">
            <button
              type="submit"
              disabled={studentSubmitting || !firebaseReady}
              className="comic-btn-primary px-12 py-4 border-4 shadow-[6px_6px_0px_0px_#030404] hover:shadow-[4px_4px_0px_0px_#030404] active:translate-x-[6px] active:translate-y-[6px] tracking-widest text-sm font-black"
            >
              {studentSubmitting ? 'Registering Feedback...' : 'Submit Feedback'}
            </button>
          </div>

        </form>

        {/* Footer */}
        <p className="mt-12 text-center text-brand-ink/40 text-[9px] uppercase font-black tracking-[0.2em]">
          JK Lakshmipat University • Aarambh '26
        </p>
      </div>
    </div>
  );
}
