
import React, { useEffect, useState } from 'react';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and then hide preloader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="relative">
        {/* Main circle */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-medical-blue to-medical-purple animate-pulse-slow"></div>
        
        {/* Bouncing balls */}
        <div className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 rounded-full bg-medical-blue animate-bounce" 
             style={{ animationDelay: '0.1s' }}></div>
        <div className="absolute top-2 left-1/2 -ml-1.5 w-3 h-3 rounded-full bg-medical-purple animate-bounce" 
             style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-4 left-1/2 -ml-1.5 w-3 h-3 rounded-full bg-medical-green animate-bounce" 
             style={{ animationDelay: '0.5s' }}></div>
        
        {/* Loading text */}
        <p className="mt-6 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
          Loading MediVerse...
        </p>
      </div>
    </div>
  );
};

export default Preloader;
