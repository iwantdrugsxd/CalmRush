const { v2: cloudinary } = require('cloudinary');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function checkUploads() {
  try {
    console.log('Checking Cloudinary uploads...');
    
    // List all videos in your account
    const result = await cloudinary.api.resources({
      resource_type: 'video',
      type: 'upload',
      max_results: 50
    });
    
    console.log(`Found ${result.resources.length} videos in your Cloudinary account:`);
    
    result.resources.forEach((video, index) => {
      console.log(`${index + 1}. ${video.public_id}`);
      console.log(`   URL: ${video.secure_url}`);
      console.log(`   Size: ${(video.bytes / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Format: ${video.format}`);
      console.log('');
    });
    
    // Check specifically for our videos
    const landingVideo = result.resources.find(v => v.public_id === 'landing-video');
    const playgroundVideo = result.resources.find(v => v.public_id === 'playground-video');
    
    console.log('🎬 Video Status:');
    console.log(`Landing video: ${landingVideo ? '✅ Uploaded' : '❌ Not found'}`);
    console.log(`Playground video: ${playgroundVideo ? '✅ Uploaded' : '❌ Not found'}`);
    
    if (landingVideo) {
      console.log(`Landing video URL: ${landingVideo.secure_url}`);
    }
    if (playgroundVideo) {
      console.log(`Playground video URL: ${playgroundVideo.secure_url}`);
    }
    
  } catch (error) {
    console.error('Error checking uploads:', error);
  }
}

checkUploads();
