import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const themes = [
      {
        id: 'aurora',
        name: 'Aurora Borealis',
        description: 'Dancing lights of the northern sky',
        backgroundVideo: '/videos/aurora-bg.mp4',
        colors: {
          primary: '#4f46e5',
          secondary: '#7c3aed',
          accent: '#06b6d4'
        },
        particles: true,
        intensity: 'medium'
      },
      {
        id: 'ocean',
        name: 'Deep Ocean',
        description: 'Serene depths of the blue abyss',
        backgroundVideo: '/videos/ocean-bg.mp4',
        colors: {
          primary: '#0c4a6e',
          secondary: '#075985',
          accent: '#0284c7'
        },
        particles: true,
        intensity: 'subtle'
      },
      {
        id: 'forest',
        name: 'Mystical Forest',
        description: 'Ancient woods with dappled sunlight',
        backgroundVideo: '/videos/forest-bg.mp4',
        colors: {
          primary: '#064e3b',
          secondary: '#065f46',
          accent: '#059669'
        },
        particles: true,
        intensity: 'medium'
      },
      {
        id: 'cosmic',
        name: 'Cosmic Nebula',
        description: 'Infinite space and stellar beauty',
        backgroundVideo: '/videos/cosmic-bg.mp4',
        colors: {
          primary: '#1e1b4b',
          secondary: '#312e81',
          accent: '#581c87'
        },
        particles: true,
        intensity: 'strong'
      }
    ];

    return NextResponse.json({
      success: true,
      data: themes
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch themes' 
    }, { status: 500 });
  }
}


