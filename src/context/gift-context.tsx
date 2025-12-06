"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalyzedProfile, GiftRecommendation } from '@/lib/types';

interface GiftContextType {
  handle: string;
  setHandle: (handle: string) => void;
  jobId: string;
  setJobId: (id: string) => void;
  profileData: AnalyzedProfile | null;
  setProfileData: (data: AnalyzedProfile | null) => void;
  analysisStartTime: number;
  setAnalysisStartTime: (time: number) => void;
  recommendation: GiftRecommendation | null;
  setRecommendation: (rec: GiftRecommendation | null) => void;
  wizardAnswers: any;
  setWizardAnswers: (answers: any) => void;
  resetContext: () => void;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export function GiftProvider({ children }: { children: ReactNode }) {
  const [handle, setHandle] = useState("");
  const [jobId, setJobId] = useState("");
  const [profileData, setProfileData] = useState<AnalyzedProfile | null>(null);
  const [analysisStartTime, setAnalysisStartTime] = useState(0);
  const [recommendation, setRecommendation] = useState<GiftRecommendation | null>(null);
  const [wizardAnswers, setWizardAnswers] = useState<any>({});

  const resetContext = () => {
    setHandle("");
    setJobId("");
    setProfileData(null);
    setAnalysisStartTime(0);
    setRecommendation(null);
    setWizardAnswers({});
  };

  return (
    <GiftContext.Provider value={{
      handle, setHandle,
      jobId, setJobId,
      profileData, setProfileData,
      analysisStartTime, setAnalysisStartTime,
      recommendation, setRecommendation,
      wizardAnswers, setWizardAnswers,
      resetContext
    }}>
      {children}
    </GiftContext.Provider>
  );
}

export function useGift() {
  const context = useContext(GiftContext);
  if (context === undefined) {
    throw new Error('useGift must be used within a GiftProvider');
  }
  return context;
}
