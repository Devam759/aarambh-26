'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '@/lib/firebase';

// ============================================================================
// CUSTOM GEOMETRIC SVG ICONS (Gradient-free, Sharp, Heavy-mitre)
// ============================================================================

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

export default function ComplaintPortalPage() {
  const router = useRouter();
  const firebaseReady = isFirebaseConfigured();

  // Form States
  const [selectedDepartment, setSelectedDepartment] = useState('Hostel');
  const [customDepartment, setCustomDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [identityMode, setIdentityMode] = useState<'anonymous' | 'named'>('anonymous');
  const [studentName, setStudentName] = useState('');
  const [studentBatch, setStudentBatch] = useState('Batch 1');
  const [studentCohort, setStudentCohort] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Suggestion Box States
  const [suggestionText, setSuggestionText] = useState('');
  const [submittingSuggestion, setSubmittingSuggestion] = useState(false);
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [selectedSuggestionFiles, setSelectedSuggestionFiles] = useState<File[]>([]);

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestionError('');

    if (!suggestionText.trim()) {
      setSuggestionError('Please enter your suggestion.');
      return;
    }

    setSubmittingSuggestion(true);
    try {
      const attachmentUrls: string[] = [];
      if (selectedSuggestionFiles.length > 0 && storage) {
        const uploadPromises = selectedSuggestionFiles.map(async (file) => {
          const fileRef = ref(storage, `suggestions/${Date.now()}_${file.name}`);
          const uploadResult = await uploadBytes(fileRef, file);
          return getDownloadURL(uploadResult.ref);
        });
        const urls = await Promise.all(uploadPromises);
        attachmentUrls.push(...urls);
      }


      await addDoc(collection(db, 'suggestions'), {
        suggestion: suggestionText.trim(),
        status: 'pending',
        attachmentUrl: attachmentUrls[0] || null,
        attachmentUrls: attachmentUrls,
        submittedAt: serverTimestamp()
      });
      setSuggestionSubmitted(true);
      setSuggestionText('');
      setSelectedSuggestionFiles([]);
    } catch (err) {
      console.warn('Suggestion submission error:', err);
      let errMsg = err instanceof Error ? err.message : 'Failed to submit suggestion. Please try again.';
      if (errMsg.includes('storage/unknown') || errMsg.includes('404') || errMsg.includes('retry-limit-exceeded')) {
        errMsg = 'Storage bucket not found or upload timed out (404). Please ensure Firebase Storage is enabled/activated in the Firebase Console, or try submitting without attachments.';
      } else if (errMsg.includes('storage/unauthorized')) {
        errMsg = 'Storage permission denied. Please verify your Firebase Storage security rules allow uploads, or try submitting without attachments.';
      }
      setSuggestionError(errMsg);
    } finally {
      setSubmittingSuggestion(false);
    }


  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (selectedDepartment === 'Other' && !customDepartment.trim()) {
      setFormError('Please specify the department name.');
      return;
    }

    if (!description.trim()) {
      setFormError('Please describe your issue.');
      return;
    }

    if (identityMode === 'named' && !studentName.trim()) {
      setFormError('Please enter your name.');
      return;
    }

    if (identityMode === 'named' && !studentCohort.trim()) {
      setFormError('Please enter your cohort.');
      return;
    }

    setSubmitting(true);
    try {
      const attachmentUrls: string[] = [];
      if (selectedFiles.length > 0 && storage) {
        const uploadPromises = selectedFiles.map(async (file) => {
          const fileRef = ref(storage, `complaints/${Date.now()}_${file.name}`);
          const uploadResult = await uploadBytes(fileRef, file);
          return getDownloadURL(uploadResult.ref);
        });
        const urls = await Promise.all(uploadPromises);
        attachmentUrls.push(...urls);
      }


      await addDoc(collection(db, 'complaints'), {
        department: selectedDepartment === 'Other' ? customDepartment.trim() : selectedDepartment,
        description: description.trim(),
        anonymous: identityMode === 'anonymous',
        studentName: identityMode === 'anonymous' ? 'Anonymous' : studentName.trim(),
        studentBatch: identityMode === 'anonymous' ? null : studentBatch,
        studentCohort: identityMode === 'anonymous' ? null : studentCohort.trim(),
        status: 'pending',
        attachmentUrl: attachmentUrls[0] || null,
        attachmentUrls: attachmentUrls,
        submittedAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.warn('Complaint submission error:', err);
      let errMsg = err instanceof Error ? err.message : 'Failed to submit complaint. Please try again.';
      if (errMsg.includes('storage/unknown') || errMsg.includes('404') || errMsg.includes('retry-limit-exceeded')) {
        errMsg = 'Storage bucket not found or upload timed out (404). Please ensure Firebase Storage is enabled/activated in the Firebase Console, or try submitting without attachments.';
      } else if (errMsg.includes('storage/unauthorized')) {
        errMsg = 'Storage permission denied. Please verify your Firebase Storage security rules allow uploads, or try submitting without attachments.';
      }
      setFormError(errMsg);
    } finally {
      setSubmitting(false);
    }


  };

  return (
    <div className="min-h-screen bg-brand-cloud text-brand-ink font-sans relative pb-16">
      {/* Halftone / Dot pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#030404_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Decorative Brand Borders */}
      <div className="h-2 w-full bg-brand-gradient" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 relative z-10 space-y-8">
        
        {/* Banner header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-brand-ink pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight uppercase text-brand-ink">
              Complaint Portal
            </h1>
            <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-brand-ink/50 mt-1">
              Aarambh &apos;26 Student Grievance Resolution & Routing System
            </p>
          </div>

        </div>

        {submitted ? (
          <div className="max-w-2xl mx-auto py-12">
            <div className="bg-white border-4 border-brand-ink p-8 md:p-12 shadow-[8px_8px_0px_0px_#030404] rounded-lg text-center space-y-6">
              <div className="inline-flex items-center justify-center p-4 border-4 border-brand-ink bg-brand-orange shadow-[4px_4px_0px_0px_#030404] rounded-md">
                <CustomCheckIcon size={44} className="text-brand-ink" />
              </div>
              <h2 className="text-3xl font-display font-black uppercase text-brand-ink">
                Complaint Registered
              </h2>
              <p className="text-brand-ink/75 font-bold text-sm md:text-base leading-relaxed">
                Your complaint has been successfully submitted and routed to the Feedback Team. If you chose Anonymous mode, your name will not appear anywhere in reports.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setDescription('');
                  setStudentName('');
                  setStudentCohort('');
                  setSelectedFiles([]);
                  setFormError('');
                }}
                className="comic-btn-primary border-4 shadow-[4px_4px_0px_0px_#030404] py-3 text-center uppercase tracking-widest font-black mx-auto"
              >
                Submit Another Complaint
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Main Feature: Complaint Form Card & Note on Confidentiality side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
              
              {/* Left Column: Complaint Form */}
              <div className="lg:col-span-7">
                <div className="bg-white border-4 border-brand-ink p-5 md:p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg space-y-6">
                  
                  <div>
                    <h2 className="text-xl font-display font-black uppercase text-brand-ink">
                      File a Complaint
                    </h2>
                  </div>

                  <form onSubmit={handleComplaintSubmit} className="space-y-5">
                    
                    {/* Identity Selector */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-brand-ink tracking-wider">
                        Submission Mode
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setIdentityMode('anonymous')}
                          className={`py-2 px-3 border-2 font-display text-[11px] font-black rounded transition-all cursor-pointer text-center uppercase tracking-wider ${
                            identityMode === 'anonymous'
                              ? 'bg-brand-blue text-white border-brand-ink shadow-[2px_2px_0px_0px_#030404] translate-x-[-1px] translate-y-[-1px]'
                              : 'bg-white text-brand-ink/65 border-brand-ink shadow-[2px_2px_0px_0px_#030404] hover:bg-brand-cloud'
                          }`}
                        >
                          Anonymous
                        </button>
                        <button
                          type="button"
                          onClick={() => setIdentityMode('named')}
                          className={`py-2 px-3 border-2 font-display text-[11px] font-black rounded transition-all cursor-pointer text-center uppercase tracking-wider ${
                            identityMode === 'named'
                              ? 'bg-brand-blue text-white border-brand-ink shadow-[2px_2px_0px_0px_#030404] translate-x-[-1px] translate-y-[-1px]'
                              : 'bg-white text-brand-ink/65 border-brand-ink shadow-[2px_2px_0px_0px_#030404] hover:bg-brand-cloud'
                          }`}
                        >
                          Enter Name
                        </button>
                      </div>
                    </div>

                    {identityMode === 'named' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase text-brand-ink tracking-wider">
                            Your Full Name <span className="text-brand-pink font-black">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full bg-white border-2 border-brand-ink rounded-md py-3 px-4 text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-pink transition-colors shadow-inner"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase text-brand-ink tracking-wider">
                            Select Batch <span className="text-brand-pink font-black">*</span>
                          </label>
                          <select
                            value={studentBatch}
                            onChange={(e) => setStudentBatch(e.target.value)}
                            className="bg-white border-2 border-brand-ink text-brand-ink text-xs font-bold rounded-md py-3 px-4 focus:outline-none focus:border-brand-pink transition-colors w-full shadow-inner"
                            required
                          >
                            {["Batch 1", "Batch 2", "Batch 3", "Batch 4"].map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase text-brand-ink tracking-wider">
                            Select Cohort <span className="text-brand-pink font-black">*</span>
                          </label>
                          <select
                            value={studentCohort}
                            onChange={(e) => setStudentCohort(e.target.value)}
                            className="bg-white border-2 border-brand-ink text-brand-ink text-xs font-bold rounded-md py-3 px-4 focus:outline-none focus:border-brand-pink transition-colors w-full shadow-inner"
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

                    {/* Department select */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-brand-ink tracking-wider">
                        Department <span className="text-brand-pink font-black">*</span>
                      </label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="bg-white border-2 border-brand-ink text-brand-ink text-xs font-bold rounded-md py-3 px-4 focus:outline-none focus:border-brand-pink transition-colors w-full shadow-inner"
                        required
                      >
                        {["Hostel", "Aarambh Team", "Mess / Food", "Admin / JKLU", "Other"].map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Specify custom department name if "Other" */}
                    {selectedDepartment === 'Other' && (
                      <div className="space-y-2 animate-fade-in">
                        <label className="block text-[10px] font-black uppercase text-brand-ink tracking-wider">
                          Specify Department <span className="text-brand-pink font-black">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customDepartment}
                          onChange={(e) => setCustomDepartment(e.target.value)}
                          placeholder="Enter department name"
                          className="w-full bg-white border-2 border-brand-ink rounded-md py-3 px-4 text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-pink transition-colors shadow-inner"
                        />
                      </div>
                    )}

                    {/* Complaint Description */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-brand-ink tracking-wider">
                        Description of issue <span className="text-brand-pink font-black">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white border-2 border-brand-ink rounded-md py-3 px-4 focus:outline-none focus:border-brand-pink text-xs text-brand-ink font-bold placeholder:text-brand-ink/30 transition-colors shadow-inner resize-y min-h-[80px]"
                        placeholder="Please describe your issue or concern in detail..."
                      />
                    </div>

                    {/* Photo/Video Attachment */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-brand-ink tracking-wider">
                        Attach Photos or Videos
                      </label>
                      
                      {/* Upload Box */}
                      <div className="border-2 border-dashed border-brand-ink rounded-md p-4 bg-brand-cloud/20 text-center relative hover:bg-brand-cloud/45 transition-colors cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={(e) => {
                            if (e.target.files) {
                              const newFiles = Array.from(e.target.files);
                              setSelectedFiles((prev) => [...prev, ...newFiles]);
                            }
                            // Clear input value so same files can be re-added
                            e.target.value = '';
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-brand-ink/50 text-xs font-bold pointer-events-none">
                          <span>Click to add photos/videos</span>
                          <span className="block text-[9px] text-brand-ink/35 mt-0.5">Images or Videos (Multiple allowed)</span>
                        </div>
                      </div>

                      {/* File List */}
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <label className="block text-[9px] font-black uppercase text-brand-ink/40 tracking-wider">
                            Attached Files ({selectedFiles.length})
                          </label>
                          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                            {selectedFiles.map((file, idx) => (
                              <div key={`${file.name}-${idx}`} className="flex items-center justify-between text-xs font-bold text-brand-ink bg-white border-2 border-brand-ink rounded px-3 py-1.5 shadow-comic-sm">
                                <span className="truncate pr-4">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="text-brand-pink text-[10px] font-black uppercase hover:underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Validation Error Message */}
                    {formError && (
                      <div className="p-3 bg-brand-pink/15 text-brand-ink text-xs font-bold border-2 border-brand-ink rounded-md flex gap-2 items-center justify-center shadow-comic-sm">
                        <CustomWarningIcon className="text-brand-pink shrink-0" size={16} />
                        <span className="uppercase tracking-wide">{formError}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full comic-btn-primary border-4 shadow-[4px_4px_0px_0px_#030404] py-3.5 text-center uppercase tracking-widest font-black text-xs cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Complaint'}
                    </button>

                  </form>

                </div>
              </div>

              {/* Right Column: Confidentiality Note & Sticky Suggestion Note */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Note on Confidentiality */}
                <div className="bg-brand-blue/5 border-4 border-brand-ink p-4 md:p-5 rounded-lg shadow-[4px_4px_0px_0px_#030404] space-y-2">
                  <h3 className="text-sm font-black uppercase text-brand-blue tracking-wider border-b-2 border-brand-ink/10 pb-1">
                    Note on Confidentiality
                  </h3>
                  <p className="text-xs leading-relaxed font-bold text-brand-ink/75">
                    No complaint is publicly displayed on the portal. All submissions are visible only to the Feedback Team, OH and OSA.
                  </p>
                  <p className="text-xs leading-relaxed font-bold text-brand-ink/75">
                    If you choose Anonymous Mode, your name and batch will not appear anywhere in the reports.
                  </p>
                </div>

                {/* Suggestion Box Container with Floating Jumping Badge */}
                <div className="relative pt-4 !mt-12">
                  {/* Bouncing Badge */}
                  <div className="absolute -top-3 left-0 z-20 animate-mini-bounce">
                    <span className="bg-brand-orange text-brand-ink border-[3px] border-brand-ink text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-lg shadow-comic-sm">
                      Suggestion Box
                    </span>
                  </div>

                  {/* Idea Capsule Suggestion Box (Dark Grey Theme) */}
                  <button
                    type="button"
                    onClick={() => setShowSuggestionModal(true)}
                    className="group relative w-full flex flex-col items-center justify-center bg-[#2a2a2a] border-4 border-brand-ink py-3 px-5 md:py-4 md:px-6 shadow-[4px_4px_0px_0px_#030404] hover:shadow-[4px_4px_0px_0px_#ff6b00] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all duration-300 ease-in-out cursor-pointer text-white select-none overflow-hidden rounded-lg"
                  >
                    <style dangerouslySetInnerHTML={{ __html: `
                      @keyframes mini-bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-5px); }
                      }
                      .animate-mini-bounce {
                        animation: mini-bounce 1.5s infinite ease-in-out;
                      }
                      @keyframes capsule-rotate {
                        0%, 100% { transform: rotate(0deg); }
                        50% { transform: rotate(180deg); }
                      }
                      @keyframes dial-click {
                        0% { transform: rotate(0deg); }
                        25% { transform: rotate(90deg); }
                        50% { transform: rotate(180deg); }
                        75% { transform: rotate(270deg); }
                        100% { transform: rotate(360deg); }
                      }
                      @keyframes bulb-glow {
                        0%, 100% { fill-opacity: 0.3; }
                        50% { fill-opacity: 1; filter: drop-shadow(0 0 5px #ffe600); }
                      }
                      @keyframes ray-blink {
                        0%, 100% { opacity: 0; }
                        50% { opacity: 1; }
                      }
                      .capsule-toy {
                        transform-origin: 60px 60px;
                        animation: capsule-rotate 3s ease-in-out infinite;
                      }
                      .dial-crank {
                        transform-origin: 60px 102px;
                        animation: dial-click 2s steps(4) infinite;
                      }
                      .bulb-path {
                        animation: bulb-glow 2.5s ease-in-out infinite;
                      }
                      .bulb-rays {
                        animation: ray-blink 2.5s ease-in-out infinite;
                      }
                      .group:hover .capsule-toy {
                        animation-duration: 1.2s;
                      }
                      .group:hover .dial-crank {
                        animation-duration: 0.6s;
                      }
                      .group:hover .bulb-path {
                        animation-duration: 1.2s;
                      }
                      .group:hover .bulb-rays {
                        animation-duration: 1.2s;
                      }
                    `}} />

                    {/* Visual Animation Container */}
                    <div className="relative w-24 h-24 mb-2 flex items-center justify-center overflow-visible">
                      <svg
                        viewBox="0 0 120 140"
                        className="w-20 h-24 overflow-visible"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Stand base shadow */}
                        <path d="M25 125 L95 125 L91 132 H29 Z" fill="rgba(255, 255, 255, 0.15)" />

                        {/* Red/Orange Machine Base */}
                        <path
                          d="M30 85 L90 85 L84 125 H36 Z"
                          fill="#ff6b00"
                          stroke="#030404"
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />

                        {/* Transparent Glass Dome */}
                        <path
                          d="M32 85 V70 C32 35, 88 35, 88 70 V85 Z"
                          fill="rgba(255, 255, 255, 0.08)"
                          stroke="#030404"
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />

                        {/* Glass Reflection highlights */}
                        <path d="M40 50 C45 45, 55 42, 60 42" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                        <path d="M80 50 C83 55, 84 65, 84 72" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

                        {/* Capsule Toy (containing lightbulb) */}
                        <g className="capsule-toy">
                          {/* Bottom half - Orange */}
                          <path
                            d="M48 60 H72 V70 C72 76.6 66.6 82 60 82 C53.4 82 48 76.6 48 70 Z"
                            fill="#ff6b00"
                            stroke="#030404"
                            strokeWidth="3"
                          />
                          {/* Top half - Transparent */}
                          <path
                            d="M48 60 H72 V50 C72 43.4 66.6 38 60 38 C53.4 38 48 43.4 48 50 Z"
                            fill="white"
                            fillOpacity="0.4"
                            stroke="#030404"
                            strokeWidth="3"
                          />
                          {/* Middle seal line */}
                          <line x1="48" y1="60" x2="72" y2="60" stroke="#030404" strokeWidth="3" />

                          {/* Tiny Lightbulb inside */}
                          <g transform="translate(52, 44)">
                            {/* Bulb Glass */}
                            <path
                              className="bulb-path"
                              d="M8 2 C5.8 2 4 3.8 4 6 C4 7.3 4.8 8.5 5.6 9.3 V11 H10.4 V9.3 C11.2 8.5 12 7.3 12 6 C12 3.8 10.2 2 8 2 Z"
                              fill="#ffe600"
                              fillOpacity="0.3"
                              stroke="#030404"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                            {/* Bulb base */}
                            <rect x="6.5" y="11" width="3" height="2" fill="white" stroke="#030404" strokeWidth="1.5" />
                          </g>

                          {/* Micro glow rays */}
                          <g className="bulb-rays" opacity="0">
                            <line x1="50" y1="48" x2="46" y2="46" stroke="#ff6b00" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="70" y1="48" x2="74" y2="46" stroke="#ff6b00" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="60" y1="40" x2="60" y2="36" stroke="#ff6b00" strokeWidth="1.5" strokeLinecap="round" />
                          </g>
                        </g>

                        {/* Crank Dial */}
                        <circle cx="60" cy="102" r="12" fill="white" stroke="#030404" strokeWidth="3.5" />
                        <g className="dial-crank">
                          <rect x="57" y="90" width="6" height="24" rx="3" fill="#030404" />
                          <circle cx="60" cy="102" r="4" fill="white" />
                        </g>

                        {/* Capsule Dispenser slot */}
                        <path d="M48 125 H72 V116 C72 112 68 110 60 110 C52 110 48 112 48 116 Z" fill="#030404" />
                        <rect x="52" y="117" width="16" height="8" rx="1" fill="white" />
                      </svg>
                    </div>

                    {/* Label */}
                    <span className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-1.5">
                      <span>Idea Capsule</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-200">➔</span>
                    </span>
                  </button>
                </div>

              </div>

            </div>

            {/* Scroll indicator pointing to the content below */}
            <div className="flex flex-col items-center justify-center -mt-6 pb-2 animate-high-bounce">
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes high-bounce {
                  0%, 100% {
                    transform: translateY(-16px);
                    animation-timing-function: cubic-bezier(0.8,0,1,1);
                  }
                  50% {
                    transform: translateY(0);
                    animation-timing-function: cubic-bezier(0,0,0.2,1);
                  }
                }
                .animate-high-bounce {
                  animation: high-bounce 1.1s infinite;
                }
              `}} />
              <span className="text-xs font-black uppercase tracking-widest text-brand-ink/80">
                Scroll down for Guidelines & Routing
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4.5"
                className="text-brand-ink/80 mt-1"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>

            {/* Visual Separator */}
            <div className="border-t-4 border-dashed border-brand-ink/20 !mt-0" />

            {/* Guidelines & Philosophy Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start !mt-1">
              
              {/* Left Column: Guidelines */}
              <div className="space-y-8">
                
                {/* Philosophy of the Complaint System */}
                <div className="bg-white border-4 border-brand-ink p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg space-y-4">
                  <h2 className="text-lg md:text-xl font-display font-black uppercase text-brand-ink tracking-tight border-b-2 border-brand-ink/10 pb-2">
                    Philosophy of the Complaint System
                  </h2>
                  <p className="text-xs md:text-sm font-semibold text-brand-ink/85 leading-relaxed">
                    The Aarambh team believes that no new student should feel unheard. However, we also understand that some students may not feel comfortable walking up to someone or speaking publicly. The complaint feature on the portal exists as a last resort, not a first resort.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="border-2 border-brand-ink bg-brand-blue/5 p-4 rounded-md shadow-comic-sm space-y-1">
                      <h4 className="text-xs font-black uppercase text-brand-blue">
                        Preferred Channel (Try First)
                      </h4>
                      <p className="text-[11px] leading-relaxed font-bold text-brand-ink/70">
                        Tell your Cohort Leader &rarr; Cohort Leader raises it to the Feedback Team or relevant department. Fastest resolution.
                      </p>
                    </div>
                    <div className="border-2 border-brand-ink bg-brand-orange/5 p-4 rounded-md shadow-comic-sm space-y-1">
                      <h4 className="text-xs font-black uppercase text-brand-orange">
                        Portal Complaint (Use If Needed)
                      </h4>
                      <p className="text-[11px] leading-relaxed font-bold text-brand-ink/70">
                        If you felt unheard, could not approach anyone, or want to stay anonymous &rarr; use the portal complaint button.
                      </p>
                    </div>
                  </div>
                </div>

                {/* How to Submit a Complaint */}
                <div className="bg-white border-4 border-brand-ink p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg space-y-4">
                  <h2 className="text-lg md:text-xl font-display font-black uppercase text-brand-ink tracking-tight border-b-2 border-brand-ink/10 pb-2">
                    How to Submit a Complaint
                  </h2>
                  <ul className="space-y-2.5">
                    {[
                      "Choose submission mode: Anonymous or Enter Name.",
                      "If Enter Name is chosen, enter your Full Name, select your Batch, and enter your Cohort.",
                      "Select the Department related to your complaint. If 'Other' is chosen, specify the department name.",
                      "Describe your issue in the 'Description of issue' text box.",
                      "Optionally, attach photos or videos under 'Attach Photos or Videos'.",
                      "Click 'Submit Complaint' to route it directly to the Feedback Team."
                    ].map((step, sIdx) => (
                      <li key={sIdx} className="flex gap-3 items-start text-xs md:text-sm font-semibold text-brand-ink/80 leading-relaxed">
                        <span className="flex items-center justify-center w-5 h-5 border-2 border-brand-ink bg-brand-pink text-white font-mono text-[10px] font-black rounded-full shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_#030404]">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Right Column: Routing */}
              <div className="space-y-8">

                {/* Department Routing Table */}
                <div className="bg-white border-4 border-brand-ink p-6 shadow-[6px_6px_0px_0px_#030404] rounded-lg space-y-4">
                  <h2 className="text-lg md:text-xl font-display font-black uppercase text-brand-ink tracking-tight border-b-2 border-brand-ink/10 pb-2">
                    Department Routing
                  </h2>
                  <div className="overflow-x-auto border-2 border-brand-ink rounded shadow-comic-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-brand-ink text-brand-cloud border-b-2 border-brand-ink uppercase font-display font-black tracking-wider">
                          <th className="py-2.5 px-4">Department</th>
                          <th className="py-2.5 px-4">Examples of Complaints</th>
                          <th className="py-2.5 px-4">Handled By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-ink/20 font-bold text-brand-ink/80">
                        {[
                          { dept: "Hostel", ex: "Room issues, noise, cleanliness, security", by: "Hostel Volunteer(s)" },
                          { dept: "Aarambh Team", ex: "Schedule confusion, event issues, coordination problems", by: "Feedback Core Team" },
                          { dept: "Mess / Food", ex: "Food quality, timings, dietary needs not met", by: "Mess Volunteer(s)" },
                          { dept: "Admin / JKLU", ex: "Academic queries, ID cards, documentation", by: "Admin Liaison Volunteer" },
                          { dept: "Other", ex: "Anything that doesn't fit above categories", by: "Feedback Team Decides" }
                        ].map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-brand-cloud/30' : 'bg-white'}>
                            <td className="py-2.5 px-4 font-black uppercase text-brand-pink">{row.dept}</td>
                            <td className="py-2.5 px-4">{row.ex}</td>
                            <td className="py-2.5 px-4 text-brand-blue">{row.by}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Suggestion Box Modal Overlay */}
        {showSuggestionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/50 backdrop-blur-sm animate-fade-in">
            {/* Modal Card */}
            <div className="bg-white border-4 border-brand-ink p-6 md:p-8 shadow-[8px_8px_0px_0px_#030404] rounded-lg max-w-md w-full relative space-y-4">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setShowSuggestionModal(false);
                  setSuggestionSubmitted(false);
                  setSuggestionText('');
                  setSuggestionError('');
                  setSelectedSuggestionFiles([]);
                }}
                className="absolute top-4 right-4 text-brand-ink/70 hover:text-brand-pink font-black text-lg cursor-pointer"
              >
                ✕
              </button>

              <div>
                <h3 className="text-xl font-display font-black uppercase text-brand-ink tracking-wider border-b-2 border-brand-ink/10 pb-1.5">
                  Suggestion Box
                </h3>
                <p className="text-[10px] font-black uppercase tracking-wider text-brand-ink/40 mt-1">
                  Help us improve Aarambh &apos;26
                </p>
              </div>

              {suggestionSubmitted ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="inline-flex items-center justify-center p-3 border-4 border-brand-ink bg-brand-orange shadow-[4px_4px_0px_0px_#030404] rounded-md">
                    <CustomCheckIcon size={32} className="text-brand-ink" />
                  </div>
                  <p className="text-sm font-bold text-brand-ink">
                    Suggestion submitted successfully! Thank you for your feedback.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuggestionModal(false);
                      setSuggestionSubmitted(false);
                      setSuggestionText('');
                      setSuggestionError('');
                      setSelectedSuggestionFiles([]);
                    }}
                    className="bg-brand-blue hover:bg-secondary-dark text-white border-2 border-brand-ink font-black py-3 px-6 shadow-comic-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#030404] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer rounded-md uppercase tracking-wider text-xs mx-auto"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase text-brand-ink tracking-wider">
                      Your Suggestion <span className="text-brand-pink font-black">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={suggestionText}
                      onChange={(e) => setSuggestionText(e.target.value)}
                      placeholder="Type your suggestion here..."
                      className="w-full bg-white border-2 border-brand-ink rounded-md py-3 px-4 text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-pink transition-colors shadow-inner resize-y min-h-[100px]"
                    />
                  </div>

                  {/* Photo/Video Attachment */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase text-brand-ink tracking-wider">
                      Attach Photos or Videos
                    </label>
                    
                    {/* Upload Box */}
                    <div className="border-2 border-dashed border-brand-ink rounded-md p-4 bg-brand-cloud/20 text-center relative hover:bg-brand-cloud/45 transition-colors cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            const newFiles = Array.from(e.target.files);
                            setSelectedSuggestionFiles((prev) => [...prev, ...newFiles]);
                          }
                          // Clear input value so same files can be re-added
                          e.target.value = '';
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-brand-ink/50 text-xs font-bold pointer-events-none">
                        <span>Click to add photos/videos</span>
                        <span className="block text-[9px] text-brand-ink/35 mt-0.5">Images or Videos (Multiple allowed)</span>
                      </div>
                    </div>

                    {/* File List */}
                    {selectedSuggestionFiles.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <label className="block text-[9px] font-black uppercase text-brand-ink/40 tracking-wider">
                          Attached Files ({selectedSuggestionFiles.length})
                        </label>
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                          {selectedSuggestionFiles.map((file, idx) => (
                            <div key={`${file.name}-${idx}`} className="flex items-center justify-between text-xs font-bold text-brand-ink bg-white border-2 border-brand-ink rounded px-3 py-1.5 shadow-comic-sm">
                              <span className="truncate pr-4">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSuggestionFiles((prev) => prev.filter((_, i) => i !== idx));
                                }}
                                className="text-brand-pink text-[10px] font-black uppercase hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {suggestionError && (
                    <div className="p-2.5 bg-brand-pink/15 text-brand-ink text-[10px] font-bold border-2 border-brand-ink rounded-md flex gap-1.5 items-center justify-center shadow-comic-sm">
                      <CustomWarningIcon className="text-brand-pink shrink-0" size={14} />
                      <span className="uppercase tracking-wide">{suggestionError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingSuggestion}
                    className="w-full comic-btn-primary border-4 shadow-[4px_4px_0px_0px_#030404] py-3 text-center uppercase tracking-widest font-black text-xs cursor-pointer disabled:opacity-50"
                  >
                    {submittingSuggestion ? 'Submitting...' : 'Submit Suggestion'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
