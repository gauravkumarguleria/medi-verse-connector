
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className, size = 'md' }) => {
  const logoRef = useRef<SVGSVGElement>(null);

  // Size mappings
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    // Simple animation for the paths
    const paths = logo.querySelectorAll('path');
    
    paths.forEach((path, index) => {
      // Reset any existing animations
      path.style.animation = 'none';
      path.offsetHeight; // Trigger reflow
      
      // Apply staggered animations
      path.style.animation = `pulse 2s infinite ${index * 0.2}s`;
    });
  }, []);

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* SVG Logo */}
      <svg 
        ref={logoRef} 
        className="w-full h-full" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Heart shape */}
        <path 
          d="M50 87.5C45.8333 83.8333 33 73.5 33 56C33 47.1634 40.1634 40 49 40H51C59.8366 40 67 47.1634 67 56C67 73.5 54.1667 83.8333 50 87.5Z" 
          fill="url(#paint0_linear)" 
          className="animate-pulse-slow"
        />
        
        {/* Cross shape */}
        <path 
          d="M43 15H57V33H75V47H57V65H43V47H25V33H43V15Z" 
          fill="url(#paint1_linear)" 
          className="animate-pulse-slow"
          style={{animationDelay: '0.3s'}}
        />
        
        {/* Circular pulse overlay */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="url(#paint2_linear)" 
          strokeWidth="2" 
          strokeDasharray="6 4" 
          className="animate-spin-slow" 
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="paint0_linear" x1="33" y1="40" x2="67" y2="87.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0070F3" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="paint1_linear" x1="25" y1="15" x2="75" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="paint2_linear" x1="5" y1="5" x2="95" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0070F3" />
            <stop offset="0.5" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Add keyframes animation for pulse */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1); 
          }
          50% { 
            opacity: 0.7;
            transform: scale(0.95); 
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-pulse-slow {
          animation: pulse 3s infinite ease-in-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedLogo;
