import { NextResponse } from 'next/server';
import { generateGiftRecommendations } from '@/lib/recommendation';
import { UserPreferences } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, expectation, budget, relation, extraInfo } = body;

    // Basic Validation
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const preferences: UserPreferences = {
      username: username.replace('@', ''), // Normalize
      budget,
      relation,
      extraInfo
    };

    const result = await generateGiftRecommendations(preferences);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Analysis Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze profile' }, 
      { status: 500 }
    );
  }
}
