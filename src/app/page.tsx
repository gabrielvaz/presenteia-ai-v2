"use client"

import { useRouter } from "next/navigation";
import { LandingScreen } from "@/components/gift-ai/landing-screen";
import { useGift } from "@/context/gift-context";

export default function Home() {
  const router = useRouter();
  const { setHandle, setAnalysisStartTime, setProfileData, setIsAnalyzing } = useGift();

  const handleStart = async (inputHandle: string) => {
    setHandle(inputHandle);
    setAnalysisStartTime(Date.now());
    setIsAnalyzing(true);
    
    // Start Analysis in Background
    fetch('/api/profile/analyze', {
        method: 'POST',
        body: JSON.stringify({ instagram_handle: inputHandle }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
        if (data.profile) {
            console.log("Profile analyzed in background:", data.summary);
            setProfileData(data.profile); 
        }
    })
    .catch(err => console.error("Background analysis failed", err))
    .finally(() => setIsAnalyzing(false));

    // Navigate to Wizard
    router.push('/wizard');
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
        <LandingScreen onStart={handleStart} />
    </main>
  );
}
