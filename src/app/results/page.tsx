"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGift } from "@/context/gift-context";
import { LoadingScreen } from "@/components/gift-ai/loading-screen";
import { ResultsScreen } from "@/components/gift-ai/results-screen";
import { GiftRecommendation } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const { 
    handle, 
    profileData, 
    analysisStartTime, 
    wizardAnswers, 
    setRecommendation,
    resetContext 
  } = useGift();
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<GiftRecommendation | null>(null);

  useEffect(() => {
    // Redirect if invalid state
    if (!handle || !wizardAnswers) {
        router.replace('/');
        return;
    }

    const generateResults = async () => {
        // Enforce 30s min time from start
        const elapsed = Date.now() - analysisStartTime;
        const minTime = 30000; 
        const remaining = Math.max(0, minTime - elapsed);
        
        console.log(`Waiting extra ${remaining}ms for sync...`);
        await new Promise(resolve => setTimeout(resolve, remaining));

        // Fallback for profile data if still missing
        let currentProfile = profileData;
        if (!currentProfile) {
            console.log("Profile data missing after wait. Using handle fallback.");
            currentProfile = { 
                username: handle, 
                recentPosts: [],
                biography: "Fallback bio",
                followers: 0
            };
        }

        try {
            const res = await fetch('/api/suggestions/match', {
                method: 'POST',
                body: JSON.stringify({
                    profileData: currentProfile,
                    answers: {
                        relationship: wizardAnswers.relation,
                        occasion: wizardAnswers.occasion,
                        budget_bucket: wizardAnswers.budget,
                        known_interests: wizardAnswers.knownInterests
                    }
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) throw new Error("Match failed");
            
            const data = await res.json();
            setResult(data);
            setRecommendation(data);
            setLoading(false);

        } catch (e) {
            console.error(e);
            alert("Erro ao gerar sugestões.");
            router.push('/wizard');
        }
    };

    generateResults();

  }, [handle, wizardAnswers, profileData, analysisStartTime, router, setRecommendation]);

  const handleReset = () => {
      resetContext();
      router.push('/');
  };

  if (loading) {
      return (
        <main className="min-h-screen bg-slate-50 font-sans">
          <LoadingScreen 
            handle={handle} 
            stage="results"
            profileSummary={profileData ? {
                avatar: profileData.profilePicUrl,
                keywords: profileData.recentPosts.flatMap((p:any) => p.hashtags).slice(0, 5)
            } : undefined}
          />
        </main>
      );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
        {result && <ResultsScreen result={result} onReset={handleReset} />}
    </main>
  );
}
