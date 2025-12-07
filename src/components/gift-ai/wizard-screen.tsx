import { useState } from "react";
import { Button } from "@/components/ui/button";

import { UserPreferences } from "@/lib/types";

interface WizardScreenProps {
  handle: string;
  onComplete: (prefs: Partial<UserPreferences>) => void;
}

const STEPS = [
  {
    id: "relation",
    title: "Qual é o seu vínculo?",
    subtitle: "Isso nos ajuda a entender o nível de intimidade.",
    options: ["Amizade", "Família", "Parceiro(a)", "Colega de trabalho"],
    hasOther: true
  },
  {
    id: "occasion",
    title: "Qual é a ocasião especial?",
    subtitle: "Cada momento pede um tipo diferente de presente.",
    options: ["Natal", "Aniversário", "Amigo Secreto", "Outra ocasião"],
    hasOther: true
  },
  {
    id: "budget",
    title: "Qual é o seu orçamento?",
    subtitle: "Encontraremos opções perfeitas dentro da sua faixa.",
    options: ["Até R$50", "R$50 - R$100", "R$100 - R$200", "Acima de R$200"],
    values: ["<=50", "50-100", "100-200", "200+"], // Mapped values
    hasOther: false
  },
  {
    id: "interests",
    title: "Interesses que você já conhece",
    subtitle: "Podemos combinar com o que encontramos no Instagram.",
    multiSelect: true,
    options: ["Corrida", "Academia", "Games", "Leitura", "Viagem", "Culinária", "Tech", "Moda"],
    hasOther: true
  }
];

import { AnalysisStatusCard } from "./analysis-status-card";

export function WizardScreen({ handle, onComplete }: WizardScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const stepConfig = STEPS[currentStep];

  const handleOptionSelect = (option: string, value?: string) => {
    const key = stepConfig.id;
    const finalValue = value || option;

    if (stepConfig.multiSelect) {
      if (selectedInterests.includes(option)) {
        setSelectedInterests(prev => prev.filter(i => i !== option));
      } else {
        setSelectedInterests(prev => [...prev, option]);
      }
      return;
    }

    setAnswers((prev: any) => ({ ...prev, [key]: finalValue }));
    
    // Auto advance for single select
    if (currentStep < STEPS.length - 1) {
       setTimeout(() => setCurrentStep(prev => prev + 1), 250);
    } else {
       // Last step (actually interests is last, handles "Concluir")
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finish
      onComplete({
        ...answers,
        knownInterests: selectedInterests
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 flex flex-col h-screen justify-center">
        
        {/* Top Status Card Removed as requested */}
        {/* Just the question block remains */}

        {/* Question Block */}
        <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full space-y-8 animate-in slide-in-from-right-8 duration-500 key={currentStep}">
            <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                    {stepConfig.title}
                </h2>
                <p className="text-lg text-slate-500">
                    {stepConfig.subtitle}
                </p>
            </div>

            <div className={`grid ${stepConfig.multiSelect ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                {stepConfig.options.map((opt, idx) => {
                    const val = stepConfig.values ? stepConfig.values[idx] : opt;
                    const isSelected = stepConfig.multiSelect 
                        ? selectedInterests.includes(opt) 
                        : answers[stepConfig.id] === val;

                    return (
                        <Button
                            key={opt}
                            variant={isSelected ? "default" : "outline"}
                            className={`h-auto py-4 text-base justify-start px-6 rounded-xl border-2 transition-all ${
                                isSelected 
                                ? 'border-slate-900 bg-slate-900 text-white' 
                                : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700'
                            }`}
                            onClick={() => handleOptionSelect(opt, val)}
                        >
                            {opt}
                        </Button>
                    );
                })}
                {stepConfig.hasOther && (
                    <Button variant="ghost" className="h-auto py-4 text-base justify-start px-6 text-slate-400 hover:text-slate-600">
                        Outro...
                    </Button>
                )}
            </div>
            
            {stepConfig.multiSelect && (
                 <div className="pt-8">
                     <Button 
                        size="lg" 
                        className="w-full text-lg h-14 rounded-xl bg-slate-900"
                        onClick={handleNext}
                     >
                        Concluir e gerar presentes
                     </Button>
                 </div>
            )}
        </div>

      </div>
    </div>
  );
}
