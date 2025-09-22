import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple sentiment analysis
function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['happy', 'excited', 'great', 'amazing', 'wonderful', 'love', 'good', 'fantastic', 'awesome', 'brilliant'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'stressed', 'terrible', 'awful', 'hate', 'disappointed'];
  
  const words = text.toLowerCase().split(/\s+/);
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Get color based on sentiment
function getColorFromSentiment(sentiment: 'positive' | 'negative' | 'neutral'): 'blue' | 'red' | 'green' {
  switch (sentiment) {
    case 'positive': return 'green';
    case 'negative': return 'red';
    default: return 'blue';
  }
}

// GET - Retrieve all thoughts for the authenticated user
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const thoughts = await prisma.thought.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Ensure processed thoughts are always green
    const processedThoughts = thoughts.map(thought => ({
      ...thought,
      color: thought.isProcessed ? 'green' : thought.color,
      sentiment: thought.isProcessed ? 'positive' : thought.sentiment
    }));

    return NextResponse.json({
      success: true,
      data: processedThoughts,
      count: processedThoughts.length
    });
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve thoughts' },
      { status: 500 }
    );
  }
}

// POST - Create a new thought
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

    console.log('Creating new thought...');
    const body = await request.json();
    console.log('Request body:', body);
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.log('Invalid text provided');
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    console.log('Analyzing sentiment for:', text.trim());
    const sentiment = analyzeSentiment(text.trim());
    const color = getColorFromSentiment(sentiment);
    console.log('Sentiment analysis result:', { sentiment, color });
    
    // Generate random position within screen bounds
    const x = Math.random() * 1000 + 100; // Default screen width assumption
    const y = Math.random() * 600 + 100;  // Default screen height assumption

    const newThought = await prisma.thought.create({
      data: {
        text: text.trim(),
        x,
        y,
        color,
        sentiment,
        isProcessed: false,
        userId
      }
    });

    console.log('Created new thought:', newThought);

    // Ensure processed thoughts are always green (for future updates)
    const processedThought = {
      ...newThought,
      color: newThought.isProcessed ? 'green' : newThought.color,
      sentiment: newThought.isProcessed ? 'positive' : newThought.sentiment
    };

    return NextResponse.json({
      success: true,
      data: processedThought,
      message: 'Thought created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating thought:', error);
    return NextResponse.json(
      { success: false, error: `Failed to create thought: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// PUT - Update thought position or status
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, x, y, isProcessed, solution } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Thought ID is required' },
        { status: 400 }
      );
    }

    const updateData: {
      x?: number;
      y?: number;
      isProcessed?: boolean;
      solution?: string;
      color?: string;
      sentiment?: string;
    } = {};
    if (x !== undefined) updateData.x = x;
    if (y !== undefined) updateData.y = y;
    if (isProcessed !== undefined) updateData.isProcessed = isProcessed;
    if (solution !== undefined) updateData.solution = solution;
    
    // If thought is being processed, ensure it's green
    if (isProcessed === true) {
      updateData.color = 'green';
      updateData.sentiment = 'positive';
    }

    const updatedThought = await prisma.thought.update({
      where: {
        id: id,
        userId // Ensure user can only update their own thoughts
      },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedThought,
      message: 'Thought updated successfully'
    });

  } catch (error) {
    console.error('Error updating thought:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update thought' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a thought
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Thought ID is required' },
        { status: 400 }
      );
    }

    const deletedThought = await prisma.thought.delete({
      where: {
        id: id,
        userId // Ensure user can only delete their own thoughts
      }
    });

    return NextResponse.json({
      success: true,
      data: deletedThought,
      message: 'Thought deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting thought:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete thought' },
      { status: 500 }
    );
  }
}