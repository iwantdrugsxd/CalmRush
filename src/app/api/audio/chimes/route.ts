import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const chimes = [
      {
        id: 'tibetan-bowl',
        name: 'Tibetan Singing Bowl',
        description: 'Traditional Himalayan meditation sound',
        file: '/audio/chimes/tibetan-bowl.mp3',
        duration: 8,
        frequency: '432Hz',
        category: 'traditional'
      },
      {
        id: 'crystal-bell',
        name: 'Crystal Bell',
        description: 'Pure, clear crystal resonance',
        file: '/audio/chimes/crystal-bell.mp3',
        duration: 6,
        frequency: '528Hz',
        category: 'crystal'
      },
      {
        id: 'bamboo-chime',
        name: 'Bamboo Chime',
        description: 'Natural wood wind chime',
        file: '/audio/chimes/bamboo-chime.mp3',
        duration: 4,
        frequency: '440Hz',
        category: 'natural'
      },
      {
        id: 'temple-bell',
        name: 'Temple Bell',
        description: 'Sacred temple bell sound',
        file: '/audio/chimes/temple-bell.mp3',
        duration: 10,
        frequency: '396Hz',
        category: 'sacred'
      },
      {
        id: 'wind-chime',
        name: 'Wind Chime',
        description: 'Gentle wind chime melody',
        file: '/audio/chimes/wind-chime.mp3',
        duration: 5,
        frequency: '528Hz',
        category: 'natural'
      },
      {
        id: 'gong',
        name: 'Gong',
        description: 'Deep, resonant gong sound',
        file: '/audio/chimes/gong.mp3',
        duration: 12,
        frequency: '256Hz',
        category: 'traditional'
      }
    ];

    return NextResponse.json({
      success: true,
      data: chimes
    });
  } catch (error) {
    console.error('Error fetching chimes:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch chimes' 
    }, { status: 500 });
  }
}



