import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CustomCloseIcon = ({ className = '', size = 20 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    className={className}
  >
    <line x1="4" y1="4" x2="20" y2="20" />
    <line x1="20" y1="4" x2="4" y2="20" />
  </svg>
);

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#030404]/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Dialog */}
      <div className="relative bg-admin-surface border-4 border-brand-ink rounded-md w-full max-w-lg shadow-[8px_8px_0px_0px_#030404] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b-2 border-brand-ink bg-white">
          <h2 className="font-adminHeading text-xl font-black uppercase tracking-tight text-brand-ink">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-admin-muted hover:text-brand-ink transition-colors cursor-pointer focus:outline-none"
          >
            <CustomCloseIcon size={18} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 overflow-y-auto bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
