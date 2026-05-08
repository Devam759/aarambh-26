import React from 'react';

export function SkeletonRow({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-admin-border rounded ${className}`}></div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-admin-surface border border-admin-border p-6 rounded-xl flex flex-col gap-4">
      <SkeletonRow className="h-4 w-1/3" />
      <SkeletonRow className="h-10 w-1/2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden">
      <div className="bg-admin-bg/50 p-4 border-b border-admin-border">
        <SkeletonRow className="h-6 w-1/4" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <SkeletonRow className="h-4 flex-1" />
            <SkeletonRow className="h-4 flex-1 hidden md:block" />
            <SkeletonRow className="h-4 flex-1 hidden lg:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
