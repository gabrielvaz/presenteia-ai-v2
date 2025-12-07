"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGift } from "@/context/gift-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Gift, Instagram, Sparkles, CheckCircle, Search, Star } from "lucide-react";
import { CatalogScreen } from "./catalog-screen"; // Importing the catalog component

interface LandingScreenProps {
  onStart?: (handle: string) => void | Promise<void>;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [inputHandle, setInputHandle] = useState("");
  const router = useRouter();
  const { setHandle } = useGift();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputHandle.trim()) return;

    if (onStart) {
        setIsLoading(true);
        // Call parent handler
        try {
             await onStart(inputHandle);
        } catch (error) {
             console.error(error);
             setIsLoading(false);
        }
        return;
    }

    // Default behavior if no prop (legacy/fallback)
    setIsLoading(true);
    // Format handle
    const cleanHandle = inputHandle.startsWith('@') ? inputHandle : `@${inputHandle}`;
    
    // Save to context
    setHandle(cleanHandle);

    // Navigate to Wizard
    router.push('/wizard');
  };

    setIsLoading(true);
    const formattedHandle = inputHandle.startsWith('@') ? inputHandle : `@${inputHandle}`;
    setHandle(formattedHandle);
    
    // Simulate initial check or just route
    await new Promise(resolve => setTimeout(resolve, 800)); // Smooth transition
    router.push('/wizard');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent opacity-70 pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-purple-100 shadow-sm text-sm font-medium text-purple-600 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles className="w-4 h-4" />
                <span>IA avançada para encontrar presentes</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                O presente perfeito começa pelo <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Instagram</span>.
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                Não sabe o que dar de presente? Nossa IA analisa o perfil público e sugere produtos incríveis da Amazon que combinam 100% com a pessoa.
            </p>

            <div className="max-w-md mx-auto relative group animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                <form onSubmit={handleStart} className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <span className="text-slate-400 font-medium text-lg">@</span>
                    </div>
                    <Input 
                        placeholder="seu_instagram" 
                        className="pl-10 h-14 text-lg bg-white border-2 border-slate-200 focus:border-purple-500 rounded-full shadow-lg pr-36 transition-all hover:border-purple-300"
                        value={inputHandle}
                        onChange={(e) => setInputHandle(e.target.value.replace('@', ''))}
                    />
                    <Button 
                        type="submit" 
                        size="lg" 
                        disabled={!inputHandle || isLoading}
                        className="absolute right-1.5 h-11 rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 transition-all font-medium"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                                Analisando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Analisar <ArrowRight className="w-4 h-4" />
                            </span>
                        )}
                    </Button>
                </form>
                <p className="text-xs text-slate-400 mt-3 flex justify-center items-center gap-1.5">
                    <Search className="w-3 h-3" /> Analisamos posts, legendas e marcações públicas.
                </p>
            </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-12 border-y border-slate-100 bg-white/50">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-slate-900">+500</h3>
                  <p className="text-sm font-medium text-slate-500">Produtos Curados</p>
              </div>
              <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-slate-900">30s</h3>
                  <p className="text-sm font-medium text-slate-500">Tempo de Análise</p>
              </div>
              <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-slate-900">98%</h3>
                  <p className="text-sm font-medium text-slate-500">Precisão da IA</p>
              </div>
              <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-slate-900 text-yellow-500">★ 4.9</h3>
                  <p className="text-sm font-medium text-slate-500">Avaliação Média</p>
              </div>
          </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16 space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Como funciona a mágica?</h2>
                  <p className="text-lg text-slate-500">Três passos simples para surpreender no presente.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-12 relative">
                  {/* Connector Line (Desktop) */}
                  <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100 -z-10"></div>

                  <div className="relative flex flex-col items-center text-center space-y-4">
                      <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 shadow-xl flex items-center justify-center relative z-10 mb-4">
                          <Instagram className="w-10 h-10 text-pink-600" />
                          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold border-4 border-white">1</div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Informe o Perfil</h3>
                      <p className="text-slate-500 leading-relaxed">
                          Basta digitar o @ do Instagram. Garantimos privacidade total: analisamos apenas dados públicos.
                      </p>
                  </div>

                  <div className="relative flex flex-col items-center text-center space-y-4">
                      <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 shadow-xl flex items-center justify-center relative z-10 mb-4">
                          <Sparkles className="w-10 h-10 text-purple-600" />
                          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold border-4 border-white">2</div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Análise com IA</h3>
                      <p className="text-slate-500 leading-relaxed">
                          Nossos algoritmos leem posts, legendas e estilo de vida para traçar um perfil psicográfico único.
                      </p>
                  </div>

                  <div className="relative flex flex-col items-center text-center space-y-4">
                      <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 shadow-xl flex items-center justify-center relative z-10 mb-4">
                          <Gift className="w-10 h-10 text-teal-500" />
                          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold border-4 border-white">3</div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Presente Perfeito</h3>
                      <p className="text-slate-500 leading-relaxed">
                          Receba uma lista curada de produtos da Amazon prontos para comprar, sem estresse.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* Catalog Preview */}
      <CatalogScreen />

      {/* Trust & Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
              <div>
                  <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                       <Gift className="w-5 h-5 text-purple-400" /> Presenteia.ai
                  </h4>
                  <p className="max-w-sm text-sm leading-relaxed opacity-80">
                      Plataforma inteligente que conecta intenção e dados para criar momentos inesquecíveis.
                  </p>
              </div>
              <div className="flex flex-col md:items-end gap-2 text-sm opacity-60">
                  <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Links seguros da Amazon
                  </div>
                  <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> IA de última geração
                  </div>
                  <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Foco em privacidade
                  </div>
                  <p className="mt-4">© 2024 Presenteia. Todos os direitos reservados.</p>
              </div>
          </div>
      </footer>
    </div>
  );
}
