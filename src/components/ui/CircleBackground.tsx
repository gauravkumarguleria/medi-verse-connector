
import React from 'react';
import { cn } from '@/lib/utils';

interface CircleBackgroundProps {
  className?: string;
}

const CircleBackground: React.FC<CircleBackgroundProps> = ({ className }) => {
  return (
    <div className={cn('absolute inset-0 overflow-hidden -z-10', className)}>
      <div className="absolute -top-[40%] -left-[20%] h-[60vh] w-[60vh] rounded-full bg-medical-blue/5 blur-3xl" />
      <div className="absolute -bottom-[30%] -right-[20%] h-[50vh] w-[50vh] rounded-full bg-medical-purple/5 blur-3xl" />
      <div className="absolute top-[20%] right-[10%] h-[40vh] w-[40vh] rounded-full bg-medical-green/5 blur-3xl" />
    </div>
  );
};

export default CircleBackground;
