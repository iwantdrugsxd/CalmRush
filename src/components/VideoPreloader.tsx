'use client';

import { useVideoPreloader } from '@/hooks/useVideoPreloader';

export default function VideoPreloader() {
  useVideoPreloader();
  return null; // This component doesn't render anything
}
