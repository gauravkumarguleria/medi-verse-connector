
import React from 'react';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';
import { Feature } from '@/types';

interface FeatureCardProps {
  feature: Feature;
  className?: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, className, index }) => {
  return (
    <GlassCard 
      className={cn(
        'h-full flex flex-col justify-between', 
        className,
        'animate-fade-up',
        // Staggered animation delay based on index
        index === 0 ? 'animation-delay-0' : 
        index === 1 ? 'animation-delay-100' : 
        index === 2 ? 'animation-delay-200' : 
        'animation-delay-300'
      )}
    >
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-medical-blue/10 text-medical-blue">
          {feature.icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    </GlassCard>
  );
};

export default FeatureCard;
