'use client';

import { useState, useEffect, useRef } from 'react';
import { videoPreloader } from '@/lib/videoPreloader';

interface CloudinaryVideoProps {
  publicId: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: (error: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

export default function CloudinaryVideo({
  publicId,
  className = '',
  style = {},
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  onLoadStart,
  onCanPlay,
  onError,
}: CloudinaryVideoProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Check if video is already preloaded
        const preloadedUrl = videoPreloader.getVideoUrl(publicId);
        if (preloadedUrl) {
          console.log(`✅ Using preloaded video: ${publicId}`);
          setVideoUrl(preloadedUrl);
          setIsLoading(false);
          onCanPlay?.();
          return;
        }

        // Try to preload the video
        console.log(`🎬 Preloading video: ${publicId}`);
        const videoUrl = await videoPreloader.preloadVideo(publicId);
        setVideoUrl(videoUrl);
        setIsLoading(false);
        onCanPlay?.();
        
      } catch (error) {
        console.error('Error fetching video URL:', error);
        setHasError(true);
        setIsLoading(false);
        onError?.(error as Event);
      }
    };

    fetchVideoUrl();
  }, [publicId, onLoadStart, onCanPlay, onError]);

  if (hasError) {
    return (
      <div 
        className={`bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center ${className}`}
        style={style}
      >
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🎬</div>
          <p className="text-lg">Video loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading || !videoUrl) {
    return (
      <div 
        className={`bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center ${className}`}
        style={style}
      >
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      className={className}
      style={style}
      onLoadStart={onLoadStart}
      onCanPlay={onCanPlay}
      onError={onError}
    >
      <source src={videoUrl} type="video/mp4" />
      <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
}
