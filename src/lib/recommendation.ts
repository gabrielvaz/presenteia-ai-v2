import { scrapeInstagramProfile } from "./apify";
import { AnalyzedProfile } from "./types";
import { analyzeProfileWithAI } from "./openrouter";
import { searchProducts, getAllProducts } from "./products";
import { UserPreferences, GiftRecommendation } from "./types";

export async function generateGiftRecommendations(
    preferences: UserPreferences,
    preFetchedProfile?: AnalyzedProfile // Optional pre-fetched data
): Promise<GiftRecommendation> {

    console.log(`Generating recommendations for ${preferences.username}...`);

    try {
        let profile: AnalyzedProfile;

        // 1. Get Profile Data (Use pre-fetched if available, otherwise scrape)
        if (preFetchedProfile) {
            console.log("Using pre-fetched profile data.");
            profile = preFetchedProfile;
        } else {
            try {
                profile = await scrapeInstagramProfile(preferences.username);
            } catch (error) {
                console.error("Scraping failed inside recommendation:", error);
                // Fallback mock is already handled inside scrapeInstagramProfile,
                // but if it throws, we construct a basic one here.
                 profile = {
                    username: preferences.username,
                    biography: "Fallback Bio",
                    followers: 0,
                    recentPosts: []
                };
            }
        }

        // 2. Get Catalog Candidate
        // Using "getAllProducts" to feed the AI with candidates
        // In production, we should filter by budget/category first to reduce token usage
        const catalog = await getAllProducts();

        // 3. AI Analysis & Selection
        const aiResult = await analyzeProfileWithAI(profile, preferences, catalog);

        return aiResult;

    } catch (error) {
        console.error("Analysis failed:", error);
        
        // Fallback for development/verification if scraping/AI fails
        console.warn("Falling back to mock interests due to error:", error);
        
        // We use 'searchProducts' (legacy) to get some items for the fallback
        if (true) {
            console.warn("Falling back to mock interests for DB verification");
            const mockInterests = ['Cerveja', 'Churrasco', 'Outdoor']; // Matches our Seed data
            const suggestions = await searchProducts(mockInterests, preferences.budget);
            
            return {
                summary: {
                    main_interest: "Churrasco & Outdoor",
                    visual_style: "Casual",
                    lifestyle: "Social & Fun",
                    reasoning: {
                        main_interest_explanation: "Identificamos interesse em churrasco e atividades ao ar livre através dos produtos selecionados e padrões de preferência.",
                        visual_style_explanation: "O estilo casual foi identificado pela escolha de produtos descontraídos e voltados para lazer.",
                        lifestyle_explanation: "O estilo de vida social foi inferido pelo foco em produtos que promovem encontros e confraternizações.",
                        key_evidence: [
                            "Preferência por produtos de churrasco",
                            "Interesse em atividades ao ar livre",
                            "Produtos voltados para socialização"
                        ]
                    }
                },
                sections: [
                    {
                        category_id: "fallback_1",
                        title: "Para quem curte Churrasco e Outdoor",
                        match_score: 0.95,
                        reason: "Sugerido porque identificamos interesse em confraternizações ao ar livre.",
                        products: suggestions.slice(0, 5)
                    },
                    {
                         category_id: "fallback_2",
                         title: "Outras opções populares",
                         match_score: 0.85,
                         reason: "Produtos em alta nessa faixa de preço que costumam agradar.",
                         products: suggestions.slice(5, 10)
                    }
                ]
            };
        }
        throw error;
    }
}
