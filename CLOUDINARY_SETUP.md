# Cloudinary Video Setup Guide

This guide will help you set up Cloudinary for hosting your videos and deploying to Vercel.

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account
2. Once logged in, go to your dashboard to get your credentials

## 2. Get Your Cloudinary Credentials

From your Cloudinary dashboard, you'll need:
- **Cloud Name** (e.g., `your-cloud-name`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Add your existing environment variables below
# DATABASE_URL=...
# NEXTAUTH_SECRET=...
# NEXTAUTH_URL=...
```

## 4. Upload Your Videos

Run the upload script to upload your videos to Cloudinary:

```bash
npm run upload-videos
```

This will:
- Upload `public/videos/Landing.mp4` as `landing-video`
- Upload `public/videos/playground-bg.mp4` as `playground-video`
- Output the Cloudinary URLs for your videos

## 5. Update Environment Variables (Optional)

After uploading, you can optionally set specific video URLs in your `.env.local`:

```env
# Optional: Set specific video URLs (if you want custom transformations)
NEXT_PUBLIC_CLOUDINARY_LANDING_VIDEO_URL=https://res.cloudinary.com/your-cloud/video/upload/f_auto,q_auto/v1/landing-video
NEXT_PUBLIC_CLOUDINARY_PLAYGROUND_VIDEO_URL=https://res.cloudinary.com/your-cloud/video/upload/f_auto,q_auto/v1/playground-video
```

## 6. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all the variables from your `.env.local` file

## 7. Remove Local Videos (Optional)

Once everything is working, you can remove the local video files to reduce your repository size:

```bash
rm public/videos/Landing.mp4
rm public/videos/playground-bg.mp4
```

## How It Works

1. **Background Preloading**: Videos are preloaded in the background when the app starts
2. **Optimized Delivery**: Cloudinary automatically optimizes videos for web delivery
3. **Global CDN**: Videos are served from Cloudinary's global CDN for fast loading
4. **Fallback Handling**: If videos fail to load, the app shows a loading state

## Video Optimization

Cloudinary automatically:
- Converts videos to optimal formats (MP4, WebM)
- Compresses videos for web delivery
- Serves videos from global CDN
- Provides adaptive streaming

## Troubleshooting

### Videos not loading?
1. Check your Cloudinary credentials in `.env.local`
2. Ensure videos were uploaded successfully with `npm run upload-videos`
3. Check browser console for error messages

### Large file uploads failing?
- Cloudinary free tier has upload limits
- Consider compressing videos before upload
- Use the chunked upload feature (already configured)

### Performance issues?
- Videos are preloaded in the background
- Check network tab to see if videos are loading from Cloudinary CDN
- Consider using different quality settings in the CloudinaryVideo component
