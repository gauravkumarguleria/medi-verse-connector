
import React from 'react';
import { cn } from '@/lib/utils';

interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
  overlayOpacity?: number;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoSrc, 
  className, 
  overlayOpacity = 60 
}) => {
  return (
    <div className={cn('absolute inset-0 overflow-hidden -z-20', className)}>
      <video 
        className="absolute w-full h-full object-cover"
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Dark overlay to ensure text remains readable */}
      <div 
        className="absolute inset-0 bg-background/60 dark:bg-background/70" 
        style={{ opacity: overlayOpacity / 100 }}
      ></div>
    </div>
  );
};

export default VideoBackground;
