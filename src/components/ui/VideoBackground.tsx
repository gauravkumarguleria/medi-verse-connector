
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
  overlayOpacity?: number;
  fallbackImage?: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoSrc, 
  className, 
  overlayOpacity = 60,
  fallbackImage
}) => {
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // List of sample videos that could be used if no specific video is provided
  const sampleVideos = [
    "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-the-sea-and-sand-with-mountains-45056-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-18312-large.mp4"
  ];

  // Randomly select a video if none provided or if the provided one failed
  const [fallbackVideoSrc, setFallbackVideoSrc] = useState<string>("");
  
  useEffect(() => {
    // Select a random sample video for fallback
    const randomIndex = Math.floor(Math.random() * sampleVideos.length);
    setFallbackVideoSrc(sampleVideos[randomIndex]);
  }, []);

  const handleVideoError = () => {
    console.log("Video failed to load, using fallback");
    setVideoError(true);
  };

  const handleVideoLoaded = () => {
    console.log("Video loaded successfully");
    setIsLoaded(true);
  };

  // Common video props to ensure consistent behavior
  const videoProps = {
    className: "absolute w-full h-full object-cover",
    autoPlay: true,
    muted: true, // Ensure videos are always muted
    loop: true,
    playsInline: true,
    preload: "auto" as const, // Preload video data for smoother playback
    onLoadedData: handleVideoLoaded
  };

  return (
    <div className={cn('absolute inset-0 overflow-hidden -z-20', className)}>
      {!videoError ? (
        <video 
          {...videoProps}
          onError={handleVideoError}
        >
          <source src={videoSrc || fallbackVideoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : fallbackImage ? (
        <img 
          src={fallbackImage} 
          alt="Background" 
          className="absolute w-full h-full object-cover"
        />
      ) : (
        <video {...videoProps}>
          <source src={fallbackVideoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Dark overlay to ensure text remains readable */}
      <div 
        className="absolute inset-0 bg-background/60 dark:bg-background/70" 
        style={{ opacity: overlayOpacity / 100 }}
      ></div>
    </div>
  );
};

export default VideoBackground;
