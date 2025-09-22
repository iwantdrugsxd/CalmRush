const { v2: cloudinary } = require('cloudinary');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadVideos() {
  try {
    console.log('Starting video upload to Cloudinary...');
    
    // Upload Landing video
    console.log('Uploading Landing.mp4...');
    const landingResult = await cloudinary.uploader.upload_large(
      path.join(__dirname, '../public/videos/Landing.mp4'),
      {
        resource_type: 'video',
        public_id: 'landing-video',
        chunk_size: 6000000, // 6MB chunks for large files
        eager: [
          { format: 'mp4', quality: 'auto' },
          { format: 'webm', quality: 'auto' }
        ],
        eager_async: true,
      }
    );
    console.log('Landing video uploaded:', landingResult.secure_url);

    // Upload Playground video
    console.log('Uploading playground-bg.mp4...');
    const playgroundResult = await cloudinary.uploader.upload_large(
      path.join(__dirname, '../public/videos/playground-bg.mp4'),
      {
        resource_type: 'video',
        public_id: 'playground-video',
        chunk_size: 6000000, // 6MB chunks for large files
        eager: [
          { format: 'mp4', quality: 'auto' },
          { format: 'webm', quality: 'auto' }
        ],
        eager_async: true,
      }
    );
    console.log('Playground video uploaded:', playgroundResult.secure_url);

    console.log('\n✅ Videos uploaded successfully!');
    console.log('\nAdd these URLs to your .env.local file:');
    console.log(`NEXT_PUBLIC_CLOUDINARY_LANDING_VIDEO_URL=${landingResult.secure_url}`);
    console.log(`NEXT_PUBLIC_CLOUDINARY_PLAYGROUND_VIDEO_URL=${playgroundResult.secure_url}`);
    
  } catch (error) {
    console.error('Error uploading videos:', error);
    process.exit(1);
  }
}

// Check if environment variables are set
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
    !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Missing Cloudinary environment variables!');
  console.log('Please set the following in your .env.local file:');
  console.log('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.log('NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key');
  console.log('CLOUDINARY_API_SECRET=your_api_secret');
  process.exit(1);
}

uploadVideos();
