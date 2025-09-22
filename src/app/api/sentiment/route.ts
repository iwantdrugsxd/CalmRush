import { NextRequest, NextResponse } from 'next/server';

// Enhanced sentiment analysis with more comprehensive word lists
const SENTIMENT_WORDS = {
  positive: [
    'happy', 'excited', 'great', 'amazing', 'wonderful', 'love', 'good', 'fantastic', 'awesome', 'brilliant',
    'excellent', 'perfect', 'beautiful', 'delighted', 'thrilled', 'joyful', 'cheerful', 'optimistic', 'hopeful',
    'grateful', 'blessed', 'lucky', 'fortunate', 'successful', 'proud', 'confident', 'motivated', 'inspired',
    'peaceful', 'calm', 'relaxed', 'content', 'satisfied', 'pleased', 'impressed', 'surprised', 'wow', 'yes'
  ],
  negative: [
    'sad', 'angry', 'frustrated', 'worried', 'anxious', 'stressed', 'terrible', 'awful', 'hate', 'disappointed',
    'upset', 'mad', 'furious', 'annoyed', 'irritated', 'depressed', 'lonely', 'scared', 'afraid', 'nervous',
    'overwhelmed', 'exhausted', 'tired', 'sick', 'hurt', 'pain', 'suffering', 'miserable', 'hopeless', 'helpless',
    'confused', 'lost', 'stuck', 'trapped', 'failing', 'losing', 'broken', 'damaged', 'ruined', 'destroyed',
    'regret', 'guilt', 'shame', 'embarrassed', 'ashamed', 'rejected', 'abandoned', 'betrayed', 'hurt', 'no'
  ]
};

// Intensity modifiers
const INTENSITY_MODIFIERS = {
  high: ['very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally', 'really', 'so', 'super', 'ultra'],
  low: ['slightly', 'a bit', 'somewhat', 'kind of', 'sort of', 'maybe', 'perhaps', 'possibly']
};

function analyzeSentiment(text: string): {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
  keywords: string[];
} {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0);

  let positiveScore = 0;
  let negativeScore = 0;
  const foundKeywords: string[] = [];

  words.forEach((word, index) => {
    // Check for positive words
    if (SENTIMENT_WORDS.positive.includes(word)) {
      positiveScore += 1;
      foundKeywords.push(word);
    }
    
    // Check for negative words
    if (SENTIMENT_WORDS.negative.includes(word)) {
      negativeScore += 1;
      foundKeywords.push(word);
    }

    // Check for intensity modifiers
    if (index > 0) {
      const prevWord = words[index - 1];
      if (INTENSITY_MODIFIERS.high.includes(prevWord)) {
        // Double the score for high intensity
        if (SENTIMENT_WORDS.positive.includes(word)) {
          positiveScore += 1;
        }
        if (SENTIMENT_WORDS.negative.includes(word)) {
          negativeScore += 1;
        }
      } else if (INTENSITY_MODIFIERS.low.includes(prevWord)) {
        // Halve the score for low intensity
        if (SENTIMENT_WORDS.positive.includes(word)) {
          positiveScore += 0.5;
        }
        if (SENTIMENT_WORDS.negative.includes(word)) {
          negativeScore += 0.5;
        }
      }
    }
  });

  const totalScore = positiveScore + negativeScore;
  const netScore = positiveScore - negativeScore;
  const confidence = totalScore > 0 ? Math.min(totalScore / words.length, 1) : 0;

  let sentiment: 'positive' | 'negative' | 'neutral';
  if (netScore > 0.5) {
    sentiment = 'positive';
  } else if (netScore < -0.5) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }

  return {
    sentiment,
    score: netScore,
    confidence,
    keywords: foundKeywords
  };
}

// POST - Analyze sentiment of text
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    const analysis = analyzeSentiment(text.trim());

    return NextResponse.json({
      success: true,
      data: {
        text: text.trim(),
        ...analysis,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}



