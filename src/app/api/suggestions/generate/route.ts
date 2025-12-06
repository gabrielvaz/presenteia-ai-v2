import { NextResponse } from 'next/server';
import { generateGiftRecommendations } from '@/lib/recommendation';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { instagram_handle, jobId, answers } = body;

        // Validation
        if (!instagram_handle) {
            return NextResponse.json({ error: "Missing handle" }, { status: 400 });
        }

        // Map body to UserPreferences
        const prefs = {
            username: instagram_handle.replace('@', ''), // scrapeInstagramProfile likely expects no @ or handles it
            jobId: jobId || "mock-job",
            relation: answers?.relationship || "Friend",
            occasion: answers?.occasion || "General",
            budget: answers?.budget_bucket || "medium",
            knownInterests: answers?.known_interests || []
        };

        const result = await generateGiftRecommendations(prefs);
        return NextResponse.json(result);
    } catch (e: any) {
        console.error("Generate API Error:", e);
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}
