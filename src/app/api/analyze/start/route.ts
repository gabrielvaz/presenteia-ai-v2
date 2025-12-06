import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const handle = body.instagram_handle;

    // TODO: Connect to real Apify start actor here
    // For now, return mock success
    
    return NextResponse.json({ 
      jobId: "mock-job-" + Date.now(),
      normalized_handle: handle.startsWith('@') ? handle : `@${handle}`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start analysis' }, { status: 500 });
  }
}
