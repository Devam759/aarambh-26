'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    // Check if the error is a ChunkLoadError
    const errorStr = (error.message || '') + (error.stack || '') + (error.name || '');
    const isChunkLoadError = 
      error.name === 'ChunkLoadError' ||
      errorStr.includes('ChunkLoadError') ||
      errorStr.includes('Loading chunk') ||
      errorStr.includes('failed');

    if (isChunkLoadError && typeof window !== 'undefined') {
      const hasReloaded = sessionStorage.getItem('chunk_load_error_reload');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_load_error_reload', 'true');
        console.warn("ChunkLoadError detected. Reloading page to fetch fresh assets...");
        window.location.reload();
        return;
      }
    }

    // We only want to log the error once per mount
    if (logged) return;
    
    console.error("Global Error Boundary Caught Exception:", error);
    
    // Fire and forget: send to backend logger
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message || 'Unknown Error',
        stack: error.stack || '',
        path: typeof window !== 'undefined' ? window.location.pathname : 'Server Render',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
        type: 'React Error Boundary Crash'
      })
    }).catch((err) => {
      console.warn("Failed to send error log to server:", err);
    });

    setLogged(true);
  }, [error, logged]);

  return (
    <div className="min-h-screen bg-brand-cloud flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 md:p-12 rounded-lg border-4 border-brand-ink shadow-[8px_8px_0px_0px_#030404] max-w-lg w-full flex flex-col items-center">
        
        {/* Bespoke Alert Icon */}
        <div className="w-20 h-20 rounded-full border-4 border-brand-ink bg-brand-pink text-white flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#030404] rotate-[-5deg]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
            <polygon points="12 2 22 20 2 20 12 2" />
          </svg>
        </div>

        <h1 className="font-adminHeading text-3xl md:text-4xl font-black uppercase tracking-tight text-brand-ink mb-4">
          System Crash
        </h1>
        
        <p className="text-brand-ink/80 font-bold text-sm md:text-base leading-relaxed mb-8">
          A critical error was encountered while rendering this page. The system administrators have been automatically notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 px-6 py-4 border-4 border-brand-ink bg-brand-orange text-brand-ink font-black uppercase tracking-widest hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#030404] active:translate-y-0 active:shadow-none transition-all focus:outline-none"
          >
            Try Again
          </button>
          
          <Link 
            href="/"
            className="flex-1 px-6 py-4 border-4 border-brand-ink bg-white text-brand-ink font-black uppercase tracking-widest hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#030404] active:translate-y-0 active:shadow-none transition-all focus:outline-none"
          >
            Go Home
          </Link>
        </div>


      </div>
    </div>
  );
}
