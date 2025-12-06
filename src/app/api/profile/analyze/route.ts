import { NextResponse } from 'next/server';
import { scrapeInstagramProfile } from '@/lib/apify';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { instagram_handle } = body;

        // Validation
        if (!instagram_handle) {
            return NextResponse.json({ error: "Missing handle" }, { status: 400 });
        }

        const username = instagram_handle.replace('@', '');
        console.log(`[API] Analyzing profile: ${username}`);
        
        const profile = await scrapeInstagramProfile(username);
        
        // Extract useful summary for frontend to display (keywords)
        const keywords = profile.recentPosts
            .flatMap(p => p.hashtags)
            .filter((tag, index, self) => self.indexOf(tag) === index) // Unique
            .slice(0, 10); // Top 10

        return NextResponse.json({
            profile,
            summary: {
                username: profile.username,
                avatar: profile.profilePicUrl || "", // You might need to add profilePicUrl to type if missing
                keywords: keywords
            }
        });
    } catch (e: any) {
        console.error("Profile Analysis API Error:", e);
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}
