
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps {
  className?: string;
  children?: React.ReactNode;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className, children }) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 animate-pulse-slow opacity-60"
        style={{
          background:
            'linear-gradient(45deg, rgba(0, 112, 243, 0.15), rgba(139, 92, 246, 0.15), rgba(16, 185, 129, 0.15))',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[100px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedGradient;
