
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ScrollFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  rootMargin?: string;
}

const ScrollFadeIn: React.FC<ScrollFadeInProps> = ({
  children,
  className,
  delay = 0,
  direction = 'up',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentElement = elementRef.current;
    
    if (!currentElement) return;
    
    // Initial styles
    let initialTransform = '';
    switch (direction) {
      case 'up': 
        initialTransform = 'translateY(20px)'; 
        break;
      case 'down': 
        initialTransform = 'translateY(-20px)'; 
        break;
      case 'left': 
        initialTransform = 'translateX(20px)'; 
        break;
      case 'right': 
        initialTransform = 'translateX(-20px)'; 
        break;
    }
    
    currentElement.style.opacity = '0';
    currentElement.style.transform = initialTransform;
    currentElement.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
    if (delay) {
      currentElement.style.transitionDelay = `${delay}ms`;
    }
    
    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              currentElement.style.opacity = '1';
              currentElement.style.transform = 'translate(0, 0)';
            });
            observer.unobserve(currentElement);
          }
        });
      },
      { threshold, rootMargin }
    );
    
    observer.observe(currentElement);
    
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [direction, delay, threshold, rootMargin]);
  
  return (
    <div ref={elementRef} className={cn(className)}>
      {children}
    </div>
  );
};

export default ScrollFadeIn;
