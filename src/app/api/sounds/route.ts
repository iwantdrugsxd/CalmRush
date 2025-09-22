import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sounds = [
      {
        id: 'forest-rain',
        name: 'Forest Rain',
        description: 'Gentle rain in a peaceful forest',
        file: '/audio/ambient/forest-rain.mp3',
        duration: 1800, // 30 minutes
        thumbnail_url: '/images/forest-rain.jpg',
        background_video_url: '/videos/forest-rain.mp4',
        category: 'nature',
        tags: ['rain', 'forest', 'peaceful', 'meditation']
      },
      {
        id: 'ocean-waves',
        name: 'Ocean Waves',
        description: 'Rhythmic waves on a sandy shore',
        file: '/audio/ambient/ocean-waves.mp3',
        duration: 1800,
        thumbnail_url: '/images/ocean-waves.jpg',
        background_video_url: '/videos/ocean-waves.mp4',
        category: 'nature',
        tags: ['ocean', 'waves', 'beach', 'calming']
      },
      {
        id: 'birds-singing',
        name: 'Birds Singing',
        description: 'Morning birds in a garden',
        file: '/audio/ambient/birds-singing.mp3',
        duration: 1200, // 20 minutes
        thumbnail_url: '/images/birds-singing.jpg',
        background_video_url: '/videos/birds-singing.mp4',
        category: 'nature',
        tags: ['birds', 'morning', 'garden', 'cheerful']
      },
      {
        id: 'thunder-storm',
        name: 'Thunder Storm',
        description: 'Distant thunder with gentle rain',
        file: '/audio/ambient/thunder-storm.mp3',
        duration: 2400, // 40 minutes
        thumbnail_url: '/images/thunder-storm.jpg',
        background_video_url: '/videos/thunder-storm.mp4',
        category: 'weather',
        tags: ['thunder', 'storm', 'rain', 'dramatic']
      },
      {
        id: 'wind-forest',
        name: 'Wind in Forest',
        description: 'Gentle breeze through tall trees',
        file: '/audio/ambient/wind-forest.mp3',
        duration: 1500, // 25 minutes
        thumbnail_url: '/images/wind-forest.jpg',
        background_video_url: '/videos/wind-forest.mp4',
        category: 'nature',
        tags: ['wind', 'forest', 'trees', 'rustling']
      },
      {
        id: 'fireplace',
        name: 'Crackling Fireplace',
        description: 'Warm, crackling fire sounds',
        file: '/audio/ambient/fireplace.mp3',
        duration: 2000, // 33 minutes
        thumbnail_url: '/images/fireplace.jpg',
        background_video_url: '/videos/fireplace.mp4',
        category: 'indoor',
        tags: ['fire', 'warmth', 'cozy', 'winter']
      },
      {
        id: 'mountain-stream',
        name: 'Mountain Stream',
        description: 'Babbling brook in the mountains',
        file: '/audio/ambient/mountain-stream.mp3',
        duration: 1800,
        thumbnail_url: '/images/mountain-stream.jpg',
        background_video_url: '/videos/mountain-stream.mp4',
        category: 'nature',
        tags: ['stream', 'water', 'mountain', 'flowing']
      },
      {
        id: 'night-crickets',
        name: 'Night Crickets',
        description: 'Peaceful evening cricket sounds',
        file: '/audio/ambient/night-crickets.mp3',
        duration: 2100, // 35 minutes
        thumbnail_url: '/images/night-crickets.jpg',
        background_video_url: '/videos/night-crickets.mp4',
        category: 'nature',
        tags: ['crickets', 'night', 'evening', 'peaceful']
      }
    ];

    return NextResponse.json({
      success: true,
      data: sounds
    });
  } catch (error) {
    console.error('Error fetching sounds:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch sounds' 
    }, { status: 500 });
  }
}


