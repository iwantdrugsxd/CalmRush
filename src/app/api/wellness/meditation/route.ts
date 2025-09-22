import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { duration } = await request.json();

    if (!duration || duration <= 0) {
      return NextResponse.json(
        { success: false, error: 'Duration is required and must be positive' },
        { status: 400 }
      );
    }

    const meditationSession = await prisma.meditationSession.create({
      data: {
        duration: Math.round(duration), // Duration in minutes
        completed: true,
        userId
      }
    });

    return NextResponse.json({
      success: true,
      data: meditationSession
    });

  } catch (error) {
    console.error('Error creating meditation session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create meditation session' },
      { status: 500 }
    );
  }
}

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

    const sessions = await prisma.meditationSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10 // Get last 10 sessions
    });

    return NextResponse.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Error fetching meditation sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch meditation sessions' },
      { status: 500 }
    );
  }
}


