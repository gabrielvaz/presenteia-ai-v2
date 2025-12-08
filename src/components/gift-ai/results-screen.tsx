"use client"

import { useState } from "react";
import { GiftRecommendation } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, Image as ImageIcon } from "lucide-react";

interface ResultsScreenProps {
  result: GiftRecommendation;
  onReset: () => void;
}

const FALLBACK_IMAGES = [
  '/gift_fallback_1.png',
  '/gift_fallback_2.png',
  '/gift_fallback_3.png',
  '/gift_fallback_4.png',
  '/gift_fallback_5.png',
];

function ProductImage({ product }: { product: any }) {
  const fallbackIndex = (product.title?.length || 0) % FALLBACK_IMAGES.length;
  const initialFallback = FALLBACK_IMAGES[fallbackIndex];
  const [imgSrc, setImgSrc] = useState(product.imageUrl || initialFallback);

  return (
    <img
      src={imgSrc}
      alt={product.title}
      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
      onError={() => {
        console.warn(`Failed to load image for ${product.title}, using fallback`);
        setImgSrc(initialFallback);
      }}
    />
  );
}

export function ResultsScreen({ result, onReset }: ResultsScreenProps) {
  const { summary, sections } = result;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-700">
      
      {/* Header Summary */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-8 px-6">
         <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-6">
             <div>
                 <h1 className="text-3xl font-bold text-slate-900 mb-2">Presentes para você</h1>
                 <p className="text-slate-500">Baseado na análise do perfil e preferências.</p>
             </div>

             <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 max-w-sm w-full">
                 <ul className="space-y-2 text-sm">
                     <li className="flex gap-2">
                         <span className="font-semibold min-w-20 text-slate-700">Interesse:</span>
                         <span className="text-slate-600">{summary.main_interest}</span>
                     </li>
                     <li className="flex gap-2">
                         <span className="font-semibold min-w-20 text-slate-700">Estilo:</span>
                         <span className="text-slate-600">{summary.visual_style}</span>
                     </li>
                     <li className="flex gap-2">
                         <span className="font-semibold min-w-20 text-slate-700">Vibe:</span>
                         <span className="text-slate-600">{summary.lifestyle}</span>
                     </li>
                 </ul>
             </div>
         </div>

         {/* Mock Filters */}
         <div className="max-w-4xl mx-auto mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
             <Button variant="default" size="sm" className="rounded-full bg-slate-900">Todos</Button>
             <Button variant="ghost" size="sm" className="rounded-full">Esportes</Button>
             <Button variant="ghost" size="sm" className="rounded-full">Tech</Button>
             <Button variant="ghost" size="sm" className="rounded-full">Casa</Button>
             <Button variant="ghost" size="sm" className="rounded-full">Moda</Button>
         </div>
      </div>

      {/* AI Insights Section - NEW */}
      {summary.reasoning && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-b border-purple-100">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Como a IA entendeu o perfil</h2>
              <p className="text-slate-600 text-sm">Veja o que identificamos e o porquê dessas conclusões</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Main Interest Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Interesse Principal</p>
                    <p className="font-bold text-slate-900">{summary.main_interest}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{summary.reasoning.main_interest_explanation}</p>
              </div>

              {/* Visual Style Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                    <span className="text-lg">🎨</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estilo Visual</p>
                    <p className="font-bold text-slate-900">{summary.visual_style}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{summary.reasoning.visual_style_explanation}</p>
              </div>

              {/* Lifestyle Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estilo de Vida</p>
                    <p className="font-bold text-slate-900">{summary.lifestyle}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{summary.reasoning.lifestyle_explanation}</p>
              </div>
            </div>

            {/* Key Evidence */}
            {summary.reasoning.key_evidence && summary.reasoning.key_evidence.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
                <p className="text-sm font-semibold text-slate-700 mb-3">📋 Principais evidências encontradas:</p>
                <ul className="space-y-2">
                  {summary.reasoning.key_evidence.map((evidence, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-600">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{evidence}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
          {sections.map((section) => (
              <div key={section.category_id} className="space-y-4">
                  <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          {Math.round(section.match_score * 100)}% match
                      </Badge>
                  </div>
                  <p className="text-slate-500 text-sm">{section.reason}</p>
                  
                  {/* Carousel Container */}
                  <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide snap-x">
                      {section.products.map(product => (
                          <div key={product.id} className="min-w-[280px] w-[280px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex-shrink-0 flex flex-col snap-center">
                              <div className="h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden group">
                                  <ProductImage product={product} />
                              </div>
                              <div className="p-4 flex-1 flex flex-col">
                                  <div className="flex items-start justify-between mb-2">
                                      <Badge variant="outline" className="text-xs bg-slate-50">{product.category}</Badge>
                                      <span className="font-bold text-slate-900 text-sm">{product.priceRange}</span>
                                  </div>
                                  <h3 className="font-semibold text-slate-900 line-clamp-2 mb-1 text-sm leading-snug min-h-[40px]">{product.title}</h3>
                                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{product.description}</p>
                                  
                                  <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="w-full mt-auto">
                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 gap-2 text-xs font-semibold h-10 shadow-sm hover:shadow-md transition-all">
                                        Ver na Amazon <ExternalLink size={14} />
                                    </Button>
                                  </a>
                              </div>
                          </div>
                      ))}
                      
                      {/* View More Card */}
                      <div className="min-w-[150px] flex items-center justify-center snap-center">
                          <Button variant="ghost" className="flex flex-col gap-2 h-auto py-8 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl">
                              <RefreshCw size={24} />
                              <span>Ver mais</span>
                          </Button>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {/* Footer CTA */}
      <div className="max-w-md mx-auto px-6 mt-12 text-center">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-purple-900 mb-2">Quer mais ideias?</h3>
              <p className="text-purple-700 text-sm mb-6">Analise outro perfil e descubra novos presentes.</p>
              <Button onClick={onReset} variant="outline" className="bg-white border-white hover:bg-white/90 text-purple-700 w-full font-semibold h-12 rounded-xl">
                  Analisar outro perfil
              </Button>
          </div>
      </div>

    </div>
  );
}
