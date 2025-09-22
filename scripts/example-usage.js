// Example of how to use the Cloudinary video system
const { cloudinary, getOptimizedVideoUrl } = require('../src/lib/cloudinary');

// Example: Get optimized video URL with custom transformations
const landingVideoUrl = getOptimizedVideoUrl('landing-video', {
  format: 'mp4',
  quality: 'auto',
  width: 1920,
  height: 1080
});

console.log('Landing video URL:', landingVideoUrl);

// Example: Get WebM format for better browser support
const playgroundVideoWebM = getOptimizedVideoUrl('playground-video', {
  format: 'webm',
  quality: 'high'
});

console.log('Playground video WebM URL:', playgroundVideoWebM);

// Example: Upload a new video (if you have the file path)
// const uploadNewVideo = async () => {
//   try {
//     const result = await cloudinary.uploader.upload('path/to/your/video.mp4', {
//       resource_type: 'video',
//       public_id: 'my-new-video',
//       chunk_size: 6000000,
//       eager: [
//         { format: 'mp4', quality: 'auto' },
//         { format: 'webm', quality: 'auto' }
//       ]
//     });
//     console.log('Video uploaded:', result.secure_url);
//   } catch (error) {
//     console.error('Upload failed:', error);
//   }
// };
