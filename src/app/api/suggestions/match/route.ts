import { NextResponse } from 'next/server';
import { generateGiftRecommendations } from '@/lib/recommendation';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { profileData, answers, jobId } = body;

        // Validation
        if (!profileData || !answers) {
            return NextResponse.json({ error: "Missing profile data or answers" }, { status: 400 });
        }

        // Map body to UserPreferences for the recommendation engine
        // Note: generateGiftRecommendations typically invokes scrape inside. 
        // We need to REFACTOR generateGiftRecommendations to accept the already-fetched profile object
        // OR we wrap it here.
        
        // Since we are refactoring, we should update `recommendation.ts` to accept `profileData` optionally
        // But for now, let's look at `UserPreferences` interface.
        
        // If we look at `recommendation.ts` (viewed previously), it takes `UserPreferences`.
        // `UserPreferences` has `username`.
        // The `generateGiftRecommendations` function calls `scrapeInstagramProfile` using that username.
        
        // WE NEED TO UPDATE `generateGiftRecommendations` to accept `preFetchedProfile` to avoid re-scraping.
        
        const prefs = {
            username: profileData.username,
            jobId: jobId || "mock-job",
            relation: answers.relationship || "Friend",
            occasion: answers.occasion || "General",
            budget: answers.budget_bucket || "medium",
            knownInterests: answers.known_interests || []
        };

        const result = await generateGiftRecommendations(prefs, profileData); // Passing 2nd arg
        return NextResponse.json(result);
    } catch (e: any) {
        console.error("Match API Error:", e);
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}
