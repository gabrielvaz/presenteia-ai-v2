import { generateGiftRecommendations } from './recommendation';
import * as OpenRouter from './openrouter';
import * as Amazon from './amazon';

// Mock dependencies
jest.mock('./apify', () => ({
  scrapeInstagramProfile: jest.fn().mockResolvedValue({
      username: 'testUser',
      biography: 'Bio',
      followers: 100,
      recentPosts: []
  })
}));

jest.spyOn(OpenRouter, 'analyzeProfileWithAI').mockResolvedValue({
    profileSummary: { traits: ['T1'], interests: ['Camping'] },
    suggestions: []
});

jest.spyOn(Amazon, 'searchAmazonProducts').mockResolvedValue([
    {
        id: '1',
        title: 'Tent',
        description: 'A tent',
        reason: 'Camping',
        priceRange: '$100',
        category: 'Outdoors',
        affiliateLink: 'http://amazon.com'
    }
]);

describe('recommendation', () => {
    it('should orchestrate services correctly', async () => {
        const result = await generateGiftRecommendations({ username: 'testUser' });
        
        expect(result.profileSummary.interests).toContain('Camping');
        expect(result.suggestions).toHaveLength(1);
        expect(result.suggestions[0].title).toBe('Tent');
    });
});
