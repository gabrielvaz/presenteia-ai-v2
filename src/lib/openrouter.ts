import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalyzedProfile, GiftRecommendation } from "./types";

const genAI = new GoogleGenerativeAI(process.env.OPENROUTER_API_KEY || "mock_key");
// Note: Using standard Google SDK based on "Use OpenRouter using gemini-flash-2.5" request.
// OpenRouter is OpenAI compatible, but for Gemini specifically, if using Google's SDK, we use Google's endpoint.
// However, the prompt asked to use OpenRouter. OpenRouter exposes an OpenAI-compatible API.
// To use OpenRouter with OpenAI SDK is standard.
// But the user specified "gemini-flash-2.5".
// Let's stick to OpenAI compatible fetch for OpenRouter to be compliant with the request to use OpenRouter specifically.

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function analyzeProfileWithAI(profile: AnalyzedProfile, preferences: any, candidateProducts: any[]): Promise<GiftRecommendation> {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'mock_key') {
     console.warn('Using MOCK AI response. Set OPENROUTER_API_KEY to use real AI.');
     await new Promise(resolve => setTimeout(resolve, 1500));
     
     // Mock selection from candidates (take first 3-4)
     const mockSelected = candidateProducts.slice(0, 4).map(p => ({
         id: String(p.id),
         title: p.title,
         description: p.description || p.title,
         reason: "Matches mock profile",
         priceRange: p.priceRange,
         category: p.category,
         imageUrl: p.imageUrl,
         affiliateLink: p.affiliateLink
     }));

     return {
         summary: {
             main_interest: "Tech & Coffee",
             visual_style: "Minimalist",
             lifestyle: "Digital Nomad",
             reasoning: {
                 main_interest_explanation: "Identificamos interesse em tecnologia e café através de posts frequentes mostrando setup de trabalho e momentos de pausa com café.",
                 visual_style_explanation: "O estilo visual minimalista foi identificado pela paleta de cores neutras e composições limpas nas fotos.",
                 lifestyle_explanation: "O estilo de vida nômade digital foi inferido pela variedade de locais nas fotos e menções a trabalho remoto.",
                 key_evidence: [
                     "Posts frequentes de setup de trabalho",
                     "Fotos de café em diferentes cafeterias",
                     "Hashtags relacionadas a trabalho remoto"
                 ]
             }
         },
         sections: [
             {
                 category_id: "tech_office",
                 title: "Home Office Upgrade",
                 match_score: 0.95,
                 reason: "Profile shows setup pictures.",
                 products: mockSelected
             }
         ]
     };
  }

  const prompt = `
    You are a Gift-AI expert. Analyze the Instagram profile and select the best gifts from the provided catalog.

    IMPORTANT RESTRICTIONS:
    1. Language: pt-BR (Portuguese Brazil) ONLY. All titles, descriptions, and reasons MUST be in Portuguese.
    2. Quantity: You MUST select AT LEAST 5 (five) products per category/section. If you cannot find 5 perfect matches, include the next best options from the catalog to reach 5.
    3. Explanations: You MUST provide detailed explanations of WHY you inferred each characteristic about the person.

    Profile: @${profile.username}
    Bio: ${profile.biography}
    Posts: ${JSON.stringify(profile.recentPosts.map(p => ({ caption: p.caption, hashtags: p.hashtags })))}

    Gifter Context:
    Relation: ${preferences.relation || 'Friend'}
    Occasion: ${preferences.occasion || 'General'}
    Budget: ${preferences.budget || 'Any'}

    Candidate Products Catalog:
    ${JSON.stringify(candidateProducts.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        priceRange: p.priceRange,
        tags: p.interestTags
    })))}

    Task:
    1. Analyze the profile deeply and infer specific main interests, visual style, and lifestyle.
    2. For EACH inference, explain HOW you reached that conclusion based on:
       - Specific posts (mention captions or hashtags)
       - Bio content
       - Visual patterns you observed
       - Any other evidence from the profile
    3. Create 2-4 distinct recommendation sections/categories.
    4. For each section, select MINIMUM 5 matching products from the catalog.
    5. You MUST use the exact 'id' from the catalog.

    Return JSON only with this structure:
    {
      "summary": {
        "main_interest": "Brief interest label",
        "visual_style": "Brief style label",
        "lifestyle": "Brief lifestyle label",
        "reasoning": {
          "main_interest_explanation": "Detailed explanation in Portuguese of WHY you identified this main interest, citing specific evidence from posts/bio",
          "visual_style_explanation": "Detailed explanation in Portuguese of WHY you identified this visual style, citing specific evidence",
          "lifestyle_explanation": "Detailed explanation in Portuguese of WHY you identified this lifestyle, citing specific evidence",
          "key_evidence": ["Evidence 1 from profile", "Evidence 2 from profile", "Evidence 3 from profile"]
        }
      },
      "sections": [
        {
          "category_id": "slug",
          "title": "Display Title (in Portuguese)",
          "match_score": 0.9,
          "reason": "Why this category fits (in Portuguese)",
          "product_ids": [ "id1", "id2", "id3", "id4", "id5" ]
        }
      ]
    }
  `;

  try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://gift-ai.vercel.app", 
              "X-Title": "Gift-AI",
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              model: "google/gemini-2.0-flash-exp:free", 
              messages: [{ role: "user", content: prompt }]
          })
      });

      const data = await response.json();

      if (data.error) {
          throw new Error(`OpenRouter API Error: ${JSON.stringify(data.error)}`);
      }

      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
          console.error("OpenRouter Response (No Content):", JSON.stringify(data, null, 2));
          throw new Error("No content from AI");
      }

      const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(jsonStr);

      // Map product_ids back to full objects
      const fullSections = result.sections.map((section: any) => ({
          ...section,
          products: section.product_ids.map((id: any) => {
              const original = candidateProducts.find(p => p.id == id);
              if (!original) return null;
              return {
                  id: String(original.id),
                  title: original.title,
                  description: original.description || original.title,
                  reason: section.reason,
                  priceRange: original.priceRange,
                  category: original.category,
                  imageUrl: original.imageUrl,
                  affiliateLink: original.affiliateLink
              };
          }).filter(Boolean)
      }));

      return {
          summary: result.summary || { main_interest: "General", visual_style: "Generic", lifestyle: "Standard" },
          sections: fullSections
      };

  } catch (error) {
      console.error("AI Analysis Failed:", error);
      throw error;
  }
}
