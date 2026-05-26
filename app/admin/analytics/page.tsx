'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { SCHEDULE_DATA } from '@/constants/events';

// ============================================================================
// BESPOKE CUSTOM GEOMETRIC SVG ICONS (Gradient-free, Sharp, Heavy-mitre)
// ============================================================================

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

const CustomStarIcon = ({ className = '', size = 24, filled = false }: { className?: string; size?: number; filled?: boolean }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={filled ? "#FF9A00" : "none"} 
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

const CustomDownloadIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CustomSettingsIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
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
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
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

// ============================================================================
// DEFAULT QUESTIONS SEED GENERATOR
// ============================================================================
export function generateDefaultFormsMap(): Record<string, { questions: any[] }> {
  const forms: Record<string, { questions: any[] }> = {};
  
  SCHEDULE_DATA.forEach((daySchedule) => {
    const questions: any[] = [];
    let qCount = 1;
    
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

export default function AdminFeedbackAnalytics() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'configurator'>('analytics');
  const router = useRouter();

  // Data States
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [exporting, setExporting] = useState(false);

  // Settings States
  const [configActiveDayIdx, setConfigActiveDayIdx] = useState<number>(0);
  const [formsMap, setFormsMap] = useState<Record<string, { questions: any[] }>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Deep Dive Active Rating Question State
  const [selectedRatingQId, setSelectedRatingQId] = useState<string>('');

  const firebaseReady = isFirebaseConfigured();

  // Authentication Setup
  useEffect(() => {
    if (!firebaseReady || !auth || !db) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [firebaseReady, router]);

  // Load Feedbacks & Active Configurations
  useEffect(() => {
    if (!user || !db) return;

    const unsubFeedbacks = onSnapshot(collection(db, 'feedback'), (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
      docs.sort((a, b) => {
        const tA = (a.submittedAt ?? a.timestamp)?.toMillis?.() ?? 0;
        const tB = (b.submittedAt ?? b.timestamp)?.toMillis?.() ?? 0;
        return tB - tA;
      });
      setFeedbacks(docs);
      setLoading(false);
    });

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
        
        const seededForms = generateDefaultFormsMap();
        const combinedForms: Record<string, any> = {};
        SCHEDULE_DATA.forEach((daySchedule) => {
          combinedForms[daySchedule.day] = dbForms[daySchedule.day] || seededForms[daySchedule.day];
        });
        
        setConfigActiveDayIdx(activeDayIdx);
        setFormsMap(combinedForms);
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    }
    loadSettings();

    return () => {
      unsubFeedbacks();
    };
  }, [user]);

  // Dynamic Backward Compatibility Compiler
  const parsedSubmissions = useMemo(() => {
    return feedbacks.map((f) => {
      if (f.answers) return f;
      
      const answers: Record<string, any> = {};
      const ratings = f.ratings || {};
      const comments = f.comments || {};
      const seeded = generateDefaultFormsMap()[f.day] || { questions: [] };
      
      seeded.questions.forEach((q) => {
        if (q.type === 'rating') {
          const score = ratings[q.label];
          if (score !== undefined) {
            answers[q.id] = {
              type: 'rating',
              label: q.label,
              value: score,
              comment: comments[q.label] || ''
            };
          }
        } else if (q.type === 'text') {
          let val = '';
          const l = q.label.toLowerCase();
          if (l.includes('like')) val = f.likedMost || '';
          else if (l.includes('improve')) val = f.improvements || '';
          else if (l.includes('suggestion')) val = f.suggestions || '';
          
          if (val.trim()) {
            answers[q.id] = {
              type: 'text',
              label: q.label,
              value: val,
              comment: ''
            };
          }
        }
      });
      
      return { ...f, answers };
    });
  }, [feedbacks]);

  // Filtered responses by Day selection
  const filteredSubmissions = useMemo(() => {
    if (selectedDayFilter === 'all') return parsedSubmissions;
    return parsedSubmissions.filter((f) => f.day === selectedDayFilter);
  }, [parsedSubmissions, selectedDayFilter]);

  const totalFormsSubmitted = filteredSubmissions.length;

  const activeQuestionsForFilter = useMemo(() => {
    if (selectedDayFilter !== 'all') {
      return formsMap[selectedDayFilter]?.questions || [];
    }
    const all: any[] = [];
    const addedIds = new Set<string>();
    Object.keys(formsMap).forEach((day) => {
      (formsMap[day]?.questions || []).forEach((q) => {
        if (!addedIds.has(q.id)) {
          all.push(q);
          addedIds.add(q.id);
        }
      });
    });
    return all;
  }, [formsMap, selectedDayFilter]);

  const ratingQuestionsList = useMemo(() => {
    return activeQuestionsForFilter.filter(q => q.type === 'rating');
  }, [activeQuestionsForFilter]);

  useEffect(() => {
    if (ratingQuestionsList.length > 0) {
      const exists = ratingQuestionsList.some(q => q.id === selectedRatingQId);
      if (!exists) {
        setSelectedRatingQId(ratingQuestionsList[0].id);
      }
    } else {
      setSelectedRatingQId('');
    }
  }, [ratingQuestionsList, selectedRatingQId]);

  const questionStats = useMemo(() => {
    const stats: Record<string, { ratings: number[]; comments: { rating: number; text: string; date: string }[]; textAnswers: { text: string; date: string }[] }> = {};

    filteredSubmissions.forEach((f) => {
      const dateStr = f.submittedAt?.toDate ? f.submittedAt.toDate().toLocaleDateString() : '';
      const answers = f.answers || {};

      Object.keys(answers).forEach((qId) => {
        const ans = answers[qId];
        if (!stats[qId]) {
          stats[qId] = { ratings: [], comments: [], textAnswers: [] };
        }

        if (ans.type === 'rating') {
          const val = Number(ans.value);
          if (val >= 1 && val <= 5) {
            stats[qId].ratings.push(val);
            if (ans.comment?.trim()) {
              stats[qId].comments.push({
                rating: val,
                text: ans.comment.trim(),
                date: dateStr
              });
            }
          }
        } else if (ans.type === 'text') {
          const val = ans.value?.trim();
          if (val) {
            stats[qId].textAnswers.push({
              text: val,
              date: dateStr
            });
          }
        }
      });
    });

    return stats;
  }, [filteredSubmissions]);

  const selectedRatingStats = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const stats = questionStats[selectedRatingQId] || { ratings: [], comments: [] };
    let total = 0;
    stats.ratings.forEach((val) => {
      if (val >= 1 && val <= 5) {
        counts[val as keyof typeof counts]++;
        total++;
      }
    });

    const distribution = [1, 2, 3, 4, 5].map((stars) => {
      const count = counts[stars as keyof typeof counts];
      const percentage = total ? (count / total) * 100 : 0;
      return { label: `${stars} Star${stars > 1 ? 's' : ''}`, count, percentage };
    });

    const sum = stats.ratings.reduce((a, b) => a + b, 0);
    const avg = total ? (sum / total).toFixed(1) : '0.0';

    return { distribution, avg, total };
  }, [questionStats, selectedRatingQId]);

  const globalAvgRating = useMemo(() => {
    let sum = 0;
    let count = 0;
    ratingQuestionsList.forEach((q) => {
      const stats = questionStats[q.id] || { ratings: [] };
      stats.ratings.forEach((val) => {
        sum += val;
        count++;
      });
    });
    return count ? (sum / count).toFixed(1) : '0.0';
  }, [ratingQuestionsList, questionStats]);

  const ratingPerformanceList = useMemo(() => {
    return ratingQuestionsList.map((q) => {
      const stats = questionStats[q.id] || { ratings: [], comments: [] };
      const totalAnswers = stats.ratings.length;
      const sum = stats.ratings.reduce((a, b) => a + b, 0);
      const avg = totalAnswers ? (sum / totalAnswers).toFixed(1) : '0.0';
      const fiveStars = totalAnswers 
        ? Math.round((stats.ratings.filter(r => r === 5).length / totalAnswers) * 100) 
        : 0;

      return {
        id: q.id,
        title: q.label,
        totalAnswers,
        avg,
        fiveStars,
        comments: stats.comments
      };
    });
  }, [ratingQuestionsList, questionStats]);

  const dynamicTextAnswers = useMemo(() => {
    const list: any[] = [];
    activeQuestionsForFilter.filter(q => q.type === 'text').forEach((q) => {
      const stats = questionStats[q.id] || { textAnswers: [] };
      if (stats.textAnswers.length > 0) {
        list.push({
          qId: q.id,
          label: q.label,
          answers: stats.textAnswers
        });
      }
    });
    return list;
  }, [activeQuestionsForFilter, questionStats]);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const excelRows: any[] = [];

      filteredSubmissions.forEach((f) => {
        const dateStr = f.submittedAt?.toDate ? f.submittedAt.toDate().toLocaleString() : '';
        const answers = f.answers || {};

        Object.keys(answers).forEach((qId) => {
          const ans = answers[qId];
          excelRows.push({
            'Timestamp': dateStr,
            'Evaluated Day': f.day,
            'Date': f.date || '',
            'Question ID': qId,
            'Question Label': ans.label,
            'Question Type': ans.type,
            'Value / Rating': ans.value,
            'Specific Comment': ans.comment || ''
          });
        });

        if (Object.keys(answers).length === 0) {
          excelRows.push({
            'Timestamp': dateStr,
            'Evaluated Day': f.day,
            'Date': f.date || '',
            'Question ID': 'N/A',
            'Question Label': 'None Rated',
            'Question Type': 'N/A',
            'Value / Rating': '',
            'Specific Comment': ''
          });
        }
      });

      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(excelRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dynamic Feedback');
      
      const fileDate = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Aarambh26_Feedback_Dynamic_${fileDate}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  const activeConfigDay = SCHEDULE_DATA[configActiveDayIdx].day;
  const configQuestionsList = useMemo(() => {
    return formsMap[activeConfigDay]?.questions || [];
  }, [formsMap, activeConfigDay]);

  const handleAddQuestion = (type: 'rating' | 'text') => {
    const newQuestion = {
      id: `q_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      label: type === 'rating' ? 'New Star Rating Question' : 'New Written Question',
      required: false
    };

    setFormsMap((prev) => {
      const dayData = prev[activeConfigDay] || { questions: [] };
      return {
        ...prev,
        [activeConfigDay]: {
          ...dayData,
          questions: [...dayData.questions, newQuestion]
        }
      };
    });
  };

  const handleUpdateQuestionLabel = (qId: string, label: string) => {
    setFormsMap((prev) => {
      const dayData = prev[activeConfigDay] || { questions: [] };
      const updated = dayData.questions.map((q) => {
        if (q.id === qId) return { ...q, label };
        return q;
      });
      return {
        ...prev,
        [activeConfigDay]: {
          ...dayData,
          questions: updated
        }
      };
    });
  };

  const handleRemoveQuestion = (qId: string) => {
    setFormsMap((prev) => {
      const dayData = prev[activeConfigDay] || { questions: [] };
      const filtered = dayData.questions.filter((q) => q.id !== qId);
      return {
        ...prev,
        [activeConfigDay]: {
          ...dayData,
          questions: filtered
        }
      };
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSaveSuccess(false);

    try {
      const activeDayId = SCHEDULE_DATA[configActiveDayIdx].day;
      await setDoc(doc(db, 'settings', 'feedback'), {
        activeDayId: activeDayId,
        forms: formsMap,
        updatedAt: serverTimestamp(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 w-full min-h-[400px]">
        <div className="text-center space-y-4">
          <CustomLoaderIcon className="text-brand-ink mx-auto" size={40} />
          <p className="text-brand-ink/50 text-[10px] font-black uppercase tracking-widest animate-pulse">
            Loading Feedback Hub Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in select-none">
      
      {/* Dynamic Sub-Navbar / Page Toggle Headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-brand-ink pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black uppercase text-brand-ink tracking-tight">
            Feedback Control Hub
          </h1>
          <p className="text-brand-ink/50 text-[10px] font-black uppercase tracking-wider font-mono">
            {activeTab === 'analytics' 
              ? 'Real-time sentiment analyzer & statistics' 
              : 'Interactive form designer & active days configurator'}
          </p>
        </div>

        {/* Dynamic Navigation Toggle Buttons inside Page Header Sub-Navbar */}
        <div className="flex gap-2 bg-white border-2 border-brand-ink p-1 shadow-[3px_3px_0px_0px_#030404] rounded-md shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-display text-[10px] font-black uppercase tracking-wider rounded-md cursor-pointer transition-all ${
              activeTab === 'analytics'
                ? 'bg-brand-pink text-white border-2 border-brand-ink shadow-[2px_2px_0px_0px_#030404] translate-x-[-1px] translate-y-[-1px]'
                : 'text-brand-ink/65 hover:bg-brand-cloud'
            }`}
            id="subnav-toggle-analytics"
          >
            Sentiment Analytics
          </button>
          <button
            onClick={() => setActiveTab('configurator')}
            className={`px-4 py-2 font-display text-[10px] font-black uppercase tracking-wider rounded-md cursor-pointer transition-all ${
              activeTab === 'configurator'
                ? 'bg-brand-pink text-white border-2 border-brand-ink shadow-[2px_2px_0px_0px_#030404] translate-x-[-1px] translate-y-[-1px]'
                : 'text-brand-ink/65 hover:bg-brand-cloud'
            }`}
            id="subnav-toggle-configurator"
          >
            Form Builder
          </button>
        </div>
      </div>

      {/* ============================================================================
          TAB: SENTIMENT ANALYSIS (ANALYTICS)
          ============================================================================ */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Day Filters & Export Button */}
          <div className="bg-white border-4 border-brand-ink p-5 shadow-[6px_6px_0px_0px_#030404] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-black uppercase text-brand-ink/65 tracking-wider shrink-0 font-mono">
                Select Evaluated Day:
              </span>
              <select
                value={selectedDayFilter}
                onChange={(e) => setSelectedDayFilter(e.target.value)}
                className="bg-white border-2 border-brand-ink text-brand-ink text-xs font-bold rounded-md py-2 px-4 focus:outline-none focus:border-brand-pink transition-colors w-full md:w-60"
              >
                <option value="all">All Days Combined</option>
                {SCHEDULE_DATA.map((day) => (
                  <option key={day.day} value={day.day}>
                    {day.day} ({day.date})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportExcel}
              disabled={feedbacks.length === 0 || exporting}
              className="bg-brand-pink hover:bg-primary-dark text-white font-black py-3 px-6 border-2 border-brand-ink shadow-[4px_4px_0px_0px_#030404] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#030404] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-md uppercase tracking-wider text-xs shrink-0"
            >
              <CustomDownloadIcon size={14} />
              <span>{exporting ? 'Exporting Report...' : 'Download Excel Sheets'}</span>
            </button>
          </div>

          {/* Quick Metrics & Chart Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Quick stats and selection graphs */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-4 border-brand-ink p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg flex items-center gap-5">
                  <div className="p-3 border-2 border-brand-ink bg-brand-pink/15 rounded-md shadow-comic-sm shrink-0">
                    <CustomMessageIcon size={24} className="text-brand-pink" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-brand-ink/50 tracking-wider">
                      Feedback Reports Submitted
                    </span>
                    <strong className="text-3xl font-display font-black text-brand-ink leading-tight">
                      {totalFormsSubmitted}
                    </strong>
                  </div>
                </div>

                <div className="bg-white border-4 border-brand-ink p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg flex items-center gap-5">
                  <div className="p-3 border-2 border-brand-ink bg-brand-orange/15 rounded-md shadow-comic-sm shrink-0">
                    <CustomStarIcon size={24} filled className="text-brand-orange" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-brand-ink/50 tracking-wider">
                      Dynamic Global Average
                    </span>
                    <strong className="text-3xl font-display font-black text-brand-ink leading-tight">
                      {globalAvgRating} <span className="text-xs text-brand-ink/40 font-bold uppercase tracking-wider font-mono">/ 5.0</span>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Star Rating Distribution Graph */}
              <div className="bg-white border-4 border-brand-ink p-6 md:p-8 shadow-[8px_8px_0px_0px_#030404] rounded-lg space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-brand-ink pb-3">
                  <h2 className="text-sm font-display font-black uppercase text-brand-ink">
                    Star Distribution Graph
                  </h2>
                  
                  {ratingQuestionsList.length > 0 && (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <span className="text-[9px] font-black uppercase tracking-wider text-brand-ink/50 shrink-0 font-mono">Question:</span>
                      <select
                        value={selectedRatingQId}
                        onChange={(e) => setSelectedRatingQId(e.target.value)}
                        className="bg-brand-cloud border-2 border-brand-ink text-brand-ink text-[10px] font-bold rounded py-1 px-2.5 focus:outline-none w-full md:w-64 truncate font-mono"
                      >
                        {ratingQuestionsList.map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {ratingQuestionsList.length === 0 ? (
                  <div className="text-center p-8 bg-brand-cloud border-2 border-brand-ink border-dashed rounded-md text-brand-ink/50 text-xs font-bold uppercase font-mono">
                    No active star rating questions configured for this selection.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    
                    {/* Average Metric Circle Box */}
                    <div className="border-4 border-brand-ink bg-white p-6 shadow-[4px_4px_0px_0px_#FF9A00] rounded-md text-center space-y-2">
                      <span className="block text-[9px] font-black uppercase tracking-wider text-brand-ink/50">
                        Item Rating Average
                      </span>
                      <strong className="text-5xl font-display font-black text-brand-ink block">
                        {selectedRatingStats.avg}
                      </strong>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <CustomStarIcon
                            key={s}
                            size={16}
                            filled={s <= Math.round(Number(selectedRatingStats.avg))}
                            className={s <= Math.round(Number(selectedRatingStats.avg)) ? 'text-brand-orange' : 'text-brand-ink/15'}
                          />
                        ))}
                      </div>
                      <span className="block text-[8px] font-black uppercase text-brand-ink/40 tracking-widest font-mono">
                        Based on {selectedRatingStats.total} responses
                      </span>
                    </div>

                    {/* Flat Neobrutalist Bar Graph Column */}
                    <div className="md:col-span-2 space-y-3.5">
                      {selectedRatingStats.distribution.slice().reverse().map((bar) => (
                        <div key={bar.label} className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-brand-ink">
                            <span>{bar.label}</span>
                            <span>{bar.count} answers ({Math.round(bar.percentage)}%)</span>
                          </div>
                          <div className="w-full bg-brand-cloud border-2 border-brand-ink rounded-md h-5 overflow-hidden p-0.5 relative shadow-inner">
                            <div
                              className="h-full bg-brand-orange border border-brand-ink rounded transition-all duration-500"
                              style={{ width: `${Math.max(bar.percentage, 2)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>

            </div>

            {/* Side Column: Dynamic Open Observations Comment Streams */}
            <div className="bg-white border-4 border-brand-ink p-6 shadow-[8px_8px_0px_0px_#030404] rounded-lg flex flex-col max-h-[560px] overflow-hidden">
              <div className="border-b-2 border-brand-ink pb-3 mb-4 shrink-0">
                <h2 className="text-sm font-display font-black uppercase text-brand-ink">
                  Written Feedback Stream
                </h2>
                <p className="text-brand-ink/40 text-[9px] uppercase tracking-wider font-black font-mono">
                  Continuous stream of dynamic open questions
                </p>
              </div>

              {dynamicTextAnswers.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-8 bg-brand-cloud border-2 border-brand-ink border-dashed rounded-md text-brand-ink/50 text-xs font-bold uppercase font-mono">
                  No text observations recorded.
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
                  {dynamicTextAnswers.map((stream) => (
                    <div key={stream.qId} className="space-y-3">
                      <span className="block text-[10px] font-black uppercase text-brand-pink tracking-wider border-b border-brand-ink/10 pb-1 font-mono">
                        Topic: {stream.label}
                      </span>
                      <div className="space-y-3">
                        {stream.answers.map((ans: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-brand-cloud border-2 border-brand-ink p-3 rounded-md shadow-comic-sm space-y-1.5"
                          >
                            <p className="text-xs font-mono font-bold text-brand-ink/85 leading-relaxed">
                              &ldquo;{ans.text}&rdquo;
                            </p>
                            <span className="block text-[8px] text-right font-black uppercase text-brand-ink/40 font-mono tracking-widest">
                              {ans.date || 'Today'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Dynamic star rating items metrics grid overview */}
          <div className="bg-white border-4 border-brand-ink p-6 md:p-8 shadow-[8px_8px_0px_0px_#030404] rounded-lg space-y-6">
            <div className="border-b-2 border-brand-ink pb-3">
              <h2 className="text-base font-display font-black uppercase text-brand-ink">
                Stars Rating Elements Comparison Table
              </h2>
            </div>

            {ratingPerformanceList.length === 0 ? (
              <div className="text-center p-8 bg-brand-cloud border-2 border-brand-ink border-dashed rounded-md text-brand-ink/50 text-xs font-bold uppercase font-mono">
                No star rating elements compiled for this selection.
              </div>
            ) : (
              <div className="overflow-x-auto border-2 border-brand-ink rounded-lg shadow-comic-sm">
                <table className="w-full border-collapse bg-white text-left text-xs font-mono text-brand-ink font-bold">
                  <thead>
                    <tr className="bg-brand-cloud border-b-2 border-brand-ink uppercase text-[10px] font-black tracking-wider text-brand-ink/80">
                      <th className="p-4 border-r-2 border-brand-ink">Evaluated Item / Title</th>
                      <th className="p-4 border-r-2 border-brand-ink text-center">Responses</th>
                      <th className="p-4 border-r-2 border-brand-ink text-center">Score Average</th>
                      <th className="p-4 border-r-2 border-brand-ink text-center">5-Star Ratio</th>
                      <th className="p-4">Recent Notes Stream</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-brand-ink/10">
                    {ratingPerformanceList.map((row) => (
                      <tr key={row.id} className="hover:bg-brand-cloud/25 transition-colors">
                        <td className="p-4 border-r-2 border-brand-ink font-black uppercase max-w-xs truncate">
                          {row.title}
                        </td>
                        <td className="p-4 border-r-2 border-brand-ink text-center font-black">
                          {row.totalAnswers}
                        </td>
                        <td className="p-4 border-r-2 border-brand-ink text-center">
                          <span className="inline-block bg-brand-orange/15 text-brand-ink border border-brand-orange/40 font-black px-2.5 py-1 rounded text-xs">
                            {row.avg} ★
                          </span>
                        </td>
                        <td className="p-4 border-r-2 border-brand-ink text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-12 bg-brand-cloud border border-brand-ink/20 rounded h-2 overflow-hidden">
                              <div className="h-full bg-brand-pink" style={{ width: `${row.fiveStars}%` }} />
                            </div>
                            <span className="font-black text-[10px]">{row.fiveStars}%</span>
                          </div>
                        </td>
                        <td className="p-4 max-w-sm truncate text-brand-ink/70">
                          {row.comments.length > 0 
                            ? `"${row.comments[0].text}"`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================================
          TAB: FORM CONFIGURATOR (GOOGLE FORMS BUILDER)
          ============================================================================ */}
      {activeTab === 'configurator' && (
        <form onSubmit={handleSaveSettings} className="space-y-8 animate-fade-in">
          
          {/* Active Settings Panel */}
          <div className="bg-white border-4 border-brand-ink p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-brand-ink/50 tracking-wider font-mono">
                Current Active Event Day (Public Route Form Target):
              </label>
              <p className="text-xs text-brand-ink/70 font-mono font-bold leading-normal">
                This dictates which custom questionnaire renders dynamically at the student feedback URL.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={SCHEDULE_DATA[configActiveDayIdx].day}
                onChange={(e) => {
                  const idx = SCHEDULE_DATA.findIndex(d => d.day === e.target.value);
                  if (idx !== -1) setConfigActiveDayIdx(idx);
                }}
                className="bg-white border-2 border-brand-ink text-brand-ink text-xs font-black rounded-md py-2.5 px-4 focus:outline-none focus:border-brand-pink transition-colors w-full uppercase tracking-wider"
              >
                {SCHEDULE_DATA.map((day, idx) => (
                  <option key={day.day} value={day.day}>
                    {day.day} ({day.date})
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={savingSettings}
                className="bg-brand-pink hover:bg-primary-dark text-white font-black py-3 px-6 border-2 border-brand-ink shadow-[4px_4px_0px_0px_#030404] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#030404] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-md uppercase tracking-wider text-xs shrink-0"
              >
                {savingSettings ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Success Dialog Banner */}
          {saveSuccess && (
            <div className="bg-brand-cloud border-4 border-brand-ink p-4 shadow-[4px_4px_0px_0px_#FF9A00] rounded-lg flex items-center gap-3 animate-bounce">
              <CustomCheckIcon className="text-brand-pink shrink-0" size={20} />
              <p className="text-xs font-mono font-black uppercase tracking-wider text-brand-ink">
                Questionnaire settings saved successfully to Firestore!
              </p>
            </div>
          )}

          {/* Main live questionnaire editor box */}
          <div className="bg-white border-4 border-brand-ink p-6 md:p-8 shadow-[8px_8px_0px_0px_#030404] rounded-lg space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-brand-ink pb-3">
              <div>
                <h2 className="text-sm font-display font-black uppercase text-brand-ink">
                  Questionnaire Item Editor ({activeConfigDay})
                </h2>
                <p className="text-brand-ink/40 text-[9px] uppercase tracking-wider font-black font-mono">
                  Add, edit, rename, or delete items instantly for {activeConfigDay}
                </p>
              </div>

              {/* Form item creators dropdown actions panel */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddQuestion('rating')}
                  className="bg-brand-cloud hover:bg-brand-orange/15 border-2 border-brand-ink text-brand-ink font-black py-2 px-3 shadow-[3px_3px_0px_0px_#030404] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#030404] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100 rounded-md text-[10px] uppercase font-mono tracking-wider cursor-pointer"
                >
                  + Add Star Rating
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('text')}
                  className="bg-brand-cloud hover:bg-brand-pink/15 border-2 border-brand-ink text-brand-ink font-black py-2 px-3 shadow-[3px_3px_0px_0px_#030404] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#030404] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100 rounded-md text-[10px] uppercase font-mono tracking-wider cursor-pointer"
                >
                  + Add Text Question
                </button>
              </div>
            </div>

            {configQuestionsList.length === 0 ? (
              <div className="text-center p-12 bg-brand-cloud border-2 border-brand-ink border-dashed rounded-md text-brand-ink/50 text-xs font-bold uppercase font-mono">
                No questionnaire questions configured yet for this day. Click buttons above to start building!
              </div>
            ) : (
              <div className="space-y-4">
                {configQuestionsList.map((q, idx) => (
                  <div
                    key={q.id}
                    className="border-2 border-brand-ink bg-white p-4 rounded-md shadow-comic-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    
                    {/* Index, badge and editor label inputs */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <span className="font-mono text-xs font-black text-brand-ink/35 select-none shrink-0">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      
                      <span className={`inline-block border border-brand-ink/20 font-mono text-[8px] font-black uppercase px-2 py-0.5 rounded shrink-0 ${
                        q.type === 'rating' 
                          ? 'bg-brand-orange/10 text-brand-orange' 
                          : 'bg-brand-pink/10 text-brand-pink'
                      }`}>
                        {q.type === 'rating' ? '★ Star Rating' : '✏️ Text Question'}
                      </span>

                      <input
                        type="text"
                        value={q.label}
                        onChange={(e) => handleUpdateQuestionLabel(q.id, e.target.value)}
                        className="bg-white border-b-2 border-brand-ink/20 focus:border-brand-pink text-xs font-bold text-brand-ink px-2 py-1.5 focus:outline-none transition-colors w-full md:w-[480px]"
                        placeholder="Define item question label here..."
                        required
                      />
                    </div>

                    {/* Question deletion button action */}
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white border border-brand-pink/30 hover:border-brand-ink py-2 px-4 shadow-[2px_2px_0px_0px_#FF188C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#030404] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100 rounded text-[9px] uppercase font-mono font-black tracking-wider cursor-pointer shrink-0 self-end md:self-auto"
                    >
                      Delete Item
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>

        </form>
      )}

    </div>
  );
}
