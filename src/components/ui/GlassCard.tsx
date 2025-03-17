
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  className, 
  children, 
  hoverEffect = true 
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-white/30 p-6 backdrop-blur-lg border border-white/20 shadow-sm',
        hoverEffect && 'transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] hover:bg-white/40',
        className
      )}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/80 to-white/30 opacity-80" />
    </div>
  );
};

export default GlassCard;
