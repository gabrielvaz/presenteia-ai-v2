import { ApifyClient } from 'apify-client';
import { AnalyzedProfile } from './types';

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

export async function scrapeInstagramProfile(username: string): Promise<AnalyzedProfile> {
    // If no API key is present, return mock data
    if (!process.env.APIFY_API_TOKEN) {
        console.warn('Using MOCK Apify response. Set APIFY_API_TOKEN to use real scraper.');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        return {
            username: username,
            biography: "Coffee enthusiast | Travel addict | Tech geek ☕✈️💻",
            followers: 1250,
            recentPosts: [
                {
                    imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80",
                    caption: "Morning brew with the new V60 setup! #coffee #specialtycoffee",
                    hashtags: ["coffee", "specialtycoffee", "v60"],
                    timestamp: new Date().toISOString()
                },
                {
                    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
                    caption: "Exploring the mountains this weekend. Nature is healing. #hiking #travel",
                    hashtags: ["hiking", "travel", "nature"],
                    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
                },
                 {
                    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
                    caption: "Coding late night. New project coming soon! #developer #tech",
                    hashtags: ["developer", "tech", "coding"],
                    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
                }
            ]
        };
    }

    // Call the Apify Actor
    try {
        const run = await client.actor("apify/instagram-profile-scraper").call({
            usernames: [username],
            resultsLimit: 12,
        });

        // Fetch results from the run's dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        
        if (!items || items.length === 0) {
            throw new Error("Profile not found or private.");
        }

        // Transform raw Apify data to our AnalyzedProfile type
        const profile = items[0] as any;
        
        return {
            username: profile.username || username,
            biography: profile.biography || "",
            followers: profile.followersCount || 0,
            profilePicUrl: profile.profilePicUrl || profile.profilePicUrlHD || "",
            recentPosts: (profile.latestPosts || []).map((post: any) => ({
                imageUrl: post.displayUrl || post.imageUrl || "",
                caption: post.caption || "",
                hashtags: post.hashtags || [],
                timestamp: post.timestamp || new Date().toISOString()
            })).filter((p: any) => p.imageUrl)
        };
    } catch (error) {
        console.warn("Apify Scrape Failed (likely quota or auth). Falling back to MOCK.", error);
        
        // Mock Fallback
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            username: username,
            biography: "Coffee enthusiast | Travel addict | Tech geek ☕✈️💻 (Mock Fallback)",
            followers: 1250,
            recentPosts: [
                {
                    imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80",
                    caption: "Morning brew with the new V60 setup! #coffee #specialtycoffee",
                    hashtags: ["coffee", "specialtycoffee", "v60"],
                    timestamp: new Date().toISOString()
                },
                {
                    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
                    caption: "Exploring the mountains this weekend. Nature is healing. #hiking #travel",
                    hashtags: ["hiking", "travel", "nature"],
                    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
                },
                 {
                    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
                    caption: "Coding late night. New project coming soon! #developer #tech",
                    hashtags: ["developer", "tech", "coding"],
                    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
                }
            ]
        };
    }
}
// Remove old logic below (we replaced it)
