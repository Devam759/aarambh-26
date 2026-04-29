import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-6 rounded-lg transition-all',
    glass: 'glass-card px-6 py-2 hover:bg-white/10 transition-all',
  };

  return (
    <button 
      className={cn(variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
}
