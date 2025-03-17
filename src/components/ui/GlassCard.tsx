
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
  hoverEffect?: boolean;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  className, 
  children, 
  hoverEffect = true,
  style
}) => {
  return (
    <div
      style={style}
      className={cn(
        'relative overflow-hidden rounded-xl border shadow-sm',
        'bg-white/30 backdrop-blur-lg border-white/20',
        'dark:bg-black/20 dark:backdrop-blur-lg dark:border-white/10',
        hoverEffect && 'transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] hover:bg-white/40 dark:hover:bg-black/30',
        className
      )}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/80 to-white/30 opacity-80 dark:from-gray-900/80 dark:to-gray-900/30 dark:opacity-50" />
    </div>
  );
};

export default GlassCard;
