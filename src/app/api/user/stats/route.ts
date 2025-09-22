import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's thought statistics
    const totalThoughts = await prisma.thought.count({
      where: { userId }
    });

    const resolvedThoughts = await prisma.thought.count({
      where: { 
        userId,
        isProcessed: true
      }
    });

    // Get user's thought history count
    const thoughtHistoryCount = await prisma.thoughtHistory.count({
      where: { userId }
    });

    // Get real meditation and breathing session data
    const meditationSessions = await prisma.meditationSession.count({
      where: { 
        userId,
        completed: true
      }
    });

    const breathingSessions = await prisma.breathingSession.count({
      where: { 
        userId,
        completed: true
      }
    });

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        createdAt: true
      }
    });

    const stats = {
      totalThoughts,
      resolvedThoughts,
      thoughtHistoryCount,
      meditationSessions,
      breathingSessions,
      user: {
        name: user?.name,
        email: user?.email,
        joinDate: user?.createdAt
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}
