export interface Thought {
  id: string;
  text: string;
  x: number;
  y: number;
  color: 'blue' | 'red' | 'green';
  sentiment: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
  isProcessed: boolean;
  confidence?: number;
  keywords?: string[];
}

export interface CreateThoughtRequest {
  text: string;
  x?: number;
  y?: number;
}

export interface UpdateThoughtRequest {
  id: string;
  x?: number;
  y?: number;
  isProcessed?: boolean;
}

class ThoughtService {
  private baseUrl = '/api/thoughts';

  async createThought(data: CreateThoughtRequest): Promise<Thought> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create thought');
      }

      return result.data;
    } catch (error) {
      console.error('Error creating thought:', error);
      throw error;
    }
  }

  async getAllThoughts(): Promise<Thought[]> {
    try {
      const response = await fetch(this.baseUrl);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch thoughts');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching thoughts:', error);
      throw error;
    }
  }

  async updateThought(data: UpdateThoughtRequest): Promise<Thought> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update thought');
      }

      return result.data;
    } catch (error) {
      console.error('Error updating thought:', error);
      throw error;
    }
  }

  async deleteThought(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete thought');
      }
    } catch (error) {
      console.error('Error deleting thought:', error);
      throw error;
    }
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
    keywords: string[];
  }> {
    try {
      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze sentiment');
      }

      return result.data;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  }

  // Utility function to get random position within screen bounds
  getRandomPosition(): { x: number; y: number } {
    if (typeof window !== 'undefined') {
      const x = Math.random() * (window.innerWidth - 200) + 100;
      const y = Math.random() * (window.innerHeight - 200) + 100;
      return { x, y };
    } else {
      // Server-side fallback
      const x = Math.random() * 1000 + 100;
      const y = Math.random() * 600 + 100;
      return { x, y };
    }
  }

  // Utility function to get color from sentiment
  getColorFromSentiment(sentiment: 'positive' | 'negative' | 'neutral'): 'blue' | 'red' | 'green' {
    switch (sentiment) {
      case 'positive': return 'green';
      case 'negative': return 'red';
      default: return 'blue';
    }
  }
}

export const thoughtService = new ThoughtService();
