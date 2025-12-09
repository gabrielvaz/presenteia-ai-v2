"use client";

import { useState } from "react";
import { Product } from "@/lib/db/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const FALLBACK_IMAGES = [
  "/gift_fallback_1.png",
  "/gift_fallback_2.png",
  "/gift_fallback_3.png",
  "/gift_fallback_4.png",
  "/gift_fallback_5.png"
];

// Allow optional properties for flexible usage (e.g. from AI result which matches GiftSuggestion)
interface ProductCardProps {
    product: Partial<Product> & { 
        title: string; 
        category?: string; 
        price?: number | null; 
        imageUrl?: string | null; 
        description?: string | null;
        affiliateLink?: string | null;
        tags?: string[];
        priceBucket?: string; // For compatibility
    };
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    // Deterministic fallback based on title length
    const fallbackIndex = (product.title?.length || 0) % FALLBACK_IMAGES.length;
    const initialFallback = FALLBACK_IMAGES[fallbackIndex];
    // If empty URL, use fallback immediately.
    const [imgSrc, setImgSrc] = useState(product.imageUrl || initialFallback);

    return (
        <Card className={`flex flex-col h-full hover:shadow-xl transition-all duration-300 border-slate-100 bg-white group ${className}`}>
            <div className="relative h-56 overflow-hidden bg-white flex items-center justify-center p-6 group-hover:bg-slate-50 transition-colors">
                 <img 
                    src={imgSrc} 
                    alt={product.title} 
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                    onError={(e) => {
                        e.currentTarget.onerror = null; // Prevent loop
                        setImgSrc(initialFallback);
                    }}
                />
                {!product.imageUrl && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur text-[10px] text-slate-400 rounded-full border border-slate-100 shadow-sm z-10">
                        Visualização
                    </span>
                )}
            </div>
            
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100 truncate max-w-[120px]">
                        {product.category || 'Geral'}
                    </Badge>
                     <span className="font-bold text-slate-900 nowrap text-sm">
                        {product.price ? `R$ ${(Number(product.price) / 100).toFixed(2)}` : (product.priceBucket || 'Ver preço')}
                    </span>
                </div>
                <CardTitle className="text-sm leading-tight font-medium text-slate-800 line-clamp-2 min-h-[2.5rem]" title={product.title}>
                    {product.title}
                </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-xs text-slate-500 line-clamp-3">
                    {product.description || "Descrição indisponível."}
                </p>
                {product.tags && product.tags.length > 0 && (
                     <div className="flex flex-wrap gap-1 mt-3">
                        {product.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-md hover:shadow-lg transition-all h-9 text-xs" asChild>
                    <a href={product.affiliateLink || '#'} target="_blank" rel="noopener noreferrer">
                        Ver na Amazon <ExternalLink className="h-3 w-3" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}
