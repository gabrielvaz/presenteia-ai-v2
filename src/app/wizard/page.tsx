"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGift } from "@/context/gift-context";
import { WizardScreen } from "@/components/gift-ai/wizard-screen";

export default function WizardPage() {
  const router = useRouter();
  const { handle, setWizardAnswers } = useGift();

  useEffect(() => {
    // If no handle, redirect to landing
    if (!handle) {
       router.replace('/');
    }
  }, [handle, router]);

  const handleWizardComplete = (answers: any) => {
    setWizardAnswers(answers);
    router.push('/results');
  };

  if (!handle) return null; // Avoid flicker

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
       <WizardScreen handle={handle} onComplete={handleWizardComplete} />
    </main>
  );
}
