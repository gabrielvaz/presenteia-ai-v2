export interface AnalyzedProfile {
  username: string;
  biography: string;
  followers: number;
  profilePicUrl?: string;
  recentPosts: {
    imageUrl: string;
    caption: string;
    hashtags: string[];
    timestamp: string;
  }[];
}

export interface UserPreferences {
  username: string;
  relation?: string;
  budget?: string; // 'low' | 'medium' | 'high' | '50-100' etc
  occasion?: string;
  extraInfo?: string;
  jobId?: string;
  knownInterests?: string[];
}

export interface GiftSuggestion {
  id: string;
  title: string;
  description: string;
  reason: string;
  priceRange: string;
  priceBucket?: string; // Compatibility
  price?: number;
  imageUrl?: string;
  affiliateLink: string;
  category: string;
}

export interface GiftRecommendation {
  summary: {
    main_interest: string;
    visual_style: string;
    lifestyle: string;
    reasoning?: {
      main_interest_explanation: string;
      visual_style_explanation: string;
      lifestyle_explanation: string;
      key_evidence: string[];
    };
  };
  sections: {
    category_id: string;
    title: string;
    match_score: number;
    reason: string;
    products: GiftSuggestion[];
  }[];
}
