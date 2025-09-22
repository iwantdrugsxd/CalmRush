import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Video URLs for different pages
export const VIDEO_URLS = {
  LANDING: process.env.NEXT_PUBLIC_CLOUDINARY_LANDING_VIDEO_URL || 
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto/v1/landing-video`,
  PLAYGROUND: process.env.NEXT_PUBLIC_CLOUDINARY_PLAYGROUND_VIDEO_URL || 
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto/v1/Untitled_3_hqjwbt`,
};

// Function to upload video to Cloudinary
export async function uploadVideo(filePath: string, publicId: string) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      public_id: publicId,
      chunk_size: 6000000, // 6MB chunks for large files
      eager: [
        { format: 'mp4', quality: 'auto' },
        { format: 'webm', quality: 'auto' }
      ],
      eager_async: true,
    });
    return result;
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw error;
  }
}

// Function to get optimized video URL
export function getOptimizedVideoUrl(publicId: string, options: {
  format?: 'mp4' | 'webm';
  quality?: 'auto' | 'high' | 'medium' | 'low';
  width?: number;
  height?: number;
} = {}) {
  const {
    format = 'mp4',
    quality = 'auto',
    width,
    height
  } = options;

  const transformations = [
    `f_${format}`,
    `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${transformations}/v1/${publicId}`;
}
