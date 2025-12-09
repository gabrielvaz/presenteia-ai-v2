import { GiftRecommendation } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink } from "lucide-react";
import { ProductCard } from "./product-card";

interface ResultsScreenProps {
  result: GiftRecommendation;
  onReset: () => void;
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

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
          {Array.isArray(sections) && sections.length > 0 ? (
            sections.map((section) => (
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
                          <div key={product.id} className="min-w-[280px] w-[280px] snap-center">
                              <ProductCard product={product} />
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
          ))
        ) : (
            <div className="text-center py-20 text-slate-400">
                Aguardando recomendações...
            </div>
        )}
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
