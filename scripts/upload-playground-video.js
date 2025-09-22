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

async function uploadPlaygroundVideo() {
  try {
    console.log('Uploading playground-bg.mp4...');
    
    // Check file size first
    const fs = require('fs');
    const filePath = path.join(__dirname, '../public/videos/playground-bg.mp4');
    const stats = fs.statSync(filePath);
    const fileSizeInMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`File size: ${fileSizeInMB} MB`);
    
    // Upload with different settings for large files
    const result = await cloudinary.uploader.upload_large(
      filePath,
      {
        resource_type: 'video',
        public_id: 'playground-video',
        chunk_size: 10000000, // 10MB chunks
        timeout: 60000, // 60 second timeout
        eager: [
          { format: 'mp4', quality: 'auto' },
          { format: 'webm', quality: 'auto' }
        ],
        eager_async: true,
      }
    );
    
    console.log('✅ Playground video uploaded successfully!');
    console.log('URL:', result.secure_url);
    
  } catch (error) {
    console.error('❌ Error uploading playground video:', error);
    
    // Try alternative upload method
    console.log('Trying alternative upload method...');
    try {
      const result = await cloudinary.uploader.upload(
        path.join(__dirname, '../public/videos/playground-bg.mp4'),
        {
          resource_type: 'video',
          public_id: 'playground-video',
          chunk_size: 5000000, // 5MB chunks
          timeout: 120000, // 2 minute timeout
        }
      );
      console.log('✅ Playground video uploaded with alternative method!');
      console.log('URL:', result.secure_url);
    } catch (altError) {
      console.error('❌ Alternative upload also failed:', altError);
    }
  }
}

uploadPlaygroundVideo();
