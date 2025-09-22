import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const patterns = [
      {
        id: 'box-breathing',
        name: 'Box Breathing',
        description: 'Equal timing for all phases - great for focus',
        pattern: [
          { state: 'inhale', duration: 4 },
          { state: 'hold', duration: 4 },
          { state: 'exhale', duration: 4 },
          { state: 'pause', duration: 4 }
        ],
        totalDuration: 16,
        difficulty: 'beginner',
        benefits: ['Focus', 'Calm', 'Balance']
      },
      {
        id: 'calming-breath',
        name: 'Calming Breath',
        description: 'Extended exhale for deep relaxation',
        pattern: [
          { state: 'inhale', duration: 4 },
          { state: 'hold', duration: 7 },
          { state: 'exhale', duration: 8 }
        ],
        totalDuration: 19,
        difficulty: 'intermediate',
        benefits: ['Relaxation', 'Sleep', 'Anxiety Relief']
      },
      {
        id: 'energizing-breath',
        name: 'Energizing Breath',
        description: 'Quick, energizing rhythm for morning practice',
        pattern: [
          { state: 'inhale', duration: 2 },
          { state: 'exhale', duration: 2 }
        ],
        totalDuration: 4,
        difficulty: 'beginner',
        benefits: ['Energy', 'Alertness', 'Focus']
      },
      {
        id: 'triangle-breathing',
        name: 'Triangle Breathing',
        description: 'Three-phase breathing for mindfulness',
        pattern: [
          { state: 'inhale', duration: 4 },
          { state: 'hold', duration: 4 },
          { state: 'exhale', duration: 4 }
        ],
        totalDuration: 12,
        difficulty: 'beginner',
        benefits: ['Mindfulness', 'Balance', 'Calm']
      },
      {
        id: '4-7-8-breathing',
        name: '4-7-8 Breathing',
        description: 'Dr. Weil\'s famous relaxation technique',
        pattern: [
          { state: 'inhale', duration: 4 },
          { state: 'hold', duration: 7 },
          { state: 'exhale', duration: 8 }
        ],
        totalDuration: 19,
        difficulty: 'intermediate',
        benefits: ['Deep Relaxation', 'Sleep', 'Stress Relief']
      },
      {
        id: 'alternate-nostril',
        name: 'Alternate Nostril',
        description: 'Balancing breath for harmony and focus',
        pattern: [
          { state: 'inhale', duration: 4 },
          { state: 'hold', duration: 4 },
          { state: 'exhale', duration: 4 },
          { state: 'pause', duration: 2 }
        ],
        totalDuration: 14,
        difficulty: 'advanced',
        benefits: ['Balance', 'Focus', 'Harmony']
      }
    ];

    return NextResponse.json({
      success: true,
      data: patterns
    });
  } catch (error) {
    console.error('Error fetching breathing patterns:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch breathing patterns' 
    }, { status: 500 });
  }
}


