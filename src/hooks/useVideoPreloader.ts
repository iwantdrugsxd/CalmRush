import { useEffect } from 'react';
import { videoPreloader } from '@/lib/videoPreloader';

export function useVideoPreloader() {
  useEffect(() => {
    // Start preloading videos in the background when the app starts
    videoPreloader.preloadAllVideos();
  }, []);
}
