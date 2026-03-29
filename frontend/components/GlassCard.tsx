import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`
      bg-zinc-900/40 
      backdrop-blur-xl 
      border border-zinc-700/50 
      rounded-2xl 
      shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] 
      p-6
      ${className}
    `}>
      {children}
    </div>
  );
}
