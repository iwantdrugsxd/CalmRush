// Video preloader service for background video fetching
export class VideoPreloader {
  private static instance: VideoPreloader;
  private preloadedVideos: Map<string, string> = new Map();
  private loadingPromises: Map<string, Promise<string>> = new Map();

  private constructor() {}

  static getInstance(): VideoPreloader {
    if (!VideoPreloader.instance) {
      VideoPreloader.instance = new VideoPreloader();
    }
    return VideoPreloader.instance;
  }

  // Preload a video from Cloudinary
  async preloadVideo(publicId: string): Promise<string> {
    // Return cached URL if already loaded
    if (this.preloadedVideos.has(publicId)) {
      return this.preloadedVideos.get(publicId)!;
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(publicId)) {
      return this.loadingPromises.get(publicId)!;
    }

    // Create new loading promise
    const loadingPromise = this.loadVideoFromCloudinary(publicId);
    this.loadingPromises.set(publicId, loadingPromise);

    try {
      const videoUrl = await loadingPromise;
      this.preloadedVideos.set(publicId, videoUrl);
      this.loadingPromises.delete(publicId);
      return videoUrl;
    } catch (error) {
      this.loadingPromises.delete(publicId);
      throw error;
    }
  }

  private async loadVideoFromCloudinary(publicId: string): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error('Cloudinary cloud name not configured');
    }

    const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/v1/${publicId}`;
    
    return new Promise((resolve, reject) => {
      // Create a video element to preload
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      
      video.onloadedmetadata = () => {
        console.log(`✅ Video preloaded: ${publicId}`);
        resolve(videoUrl);
      };
      
      video.onerror = (error) => {
        console.error(`❌ Error preloading video ${publicId}:`, error);
        reject(new Error(`Failed to preload video: ${publicId}`));
      };
      
      video.src = videoUrl;
    });
  }

  // Preload all app videos in the background
  async preloadAllVideos(): Promise<void> {
    const videosToPreload = ['landing-video', 'Untitled_3_hqjwbt'];
    
    console.log('🎬 Starting background video preloading...');
    
    try {
      // Preload all videos in parallel
      await Promise.allSettled(
        videosToPreload.map(async (publicId) => {
          try {
            await this.preloadVideo(publicId);
          } catch (error) {
            console.warn(`Failed to preload ${publicId}:`, error);
          }
        })
      );
      
      console.log('✅ Background video preloading completed');
    } catch (error) {
      console.error('Error during video preloading:', error);
    }
  }

  // Get preloaded video URL
  getVideoUrl(publicId: string): string | null {
    return this.preloadedVideos.get(publicId) || null;
  }

  // Check if video is preloaded
  isVideoPreloaded(publicId: string): boolean {
    return this.preloadedVideos.has(publicId);
  }
}

// Export singleton instance
export const videoPreloader = VideoPreloader.getInstance();
