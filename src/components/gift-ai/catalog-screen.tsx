
"use client"

import { useEffect, useState } from "react";
import { Product } from "@/lib/db/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingBag, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const FALLBACK_IMAGES = [
  "/gift_fallback_1.png",
  "/gift_fallback_2.png",
  "/gift_fallback_3.png",
  "/gift_fallback_4.png",
  "/gift_fallback_5.png"
];

// Product Card Component with Fallback Logic
function ProductCard({ product }: { product: Product }) {
    // Deterministic fallback based on title length
    const fallbackIndex = (product.title?.length || 0) % FALLBACK_IMAGES.length;
    const initialFallback = FALLBACK_IMAGES[fallbackIndex];
    // If empty URL, use fallback immediately.
    const [imgSrc, setImgSrc] = useState(product.imageUrl || initialFallback);

    return (
        <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 border-slate-100 bg-white group">
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
                        {product.category}
                    </Badge>
                     <span className="font-bold text-slate-900 nowrap">
                        {product.price ? `R$ ${(Number(product.price) / 100).toFixed(2)}` : 'Ver preço'}
                    </span>
                </div>
                <CardTitle className="text-base leading-tight font-medium text-slate-800 line-clamp-2 min-h-[2.5rem]" title={product.title}>
                    {product.title}
                </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-slate-500 line-clamp-3">
                    {product.shortDescription || product.description || "Descrição indisponível."}
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
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-md hover:shadow-lg transition-all" asChild>
                    <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
                        Ver na Amazon <ExternalLink className="h-3 w-3" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}

export function CatalogScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 24;

    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");

    // Fetch Products
    const loadProducts = async (reset = false) => {
        setLoading(true);
        const currentPage = reset ? 0 : page;
        
        try {
            const params = new URLSearchParams({
                limit: LIMIT.toString(),
                offset: (currentPage * LIMIT).toString()
            });

            if (categoryFilter !== 'all') params.set('category', categoryFilter);
            if (priceFilter !== 'all') params.set('price_bucket', priceFilter);

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();

            if (reset) {
                setProducts(data.products);
            } else {
                setProducts(prev => [...prev, ...data.products]);
            }
            
            setHasMore(data.products.length === LIMIT);
            setPage(currentPage + 1);

        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load & Filter Change
    useEffect(() => {
        setPage(0);
        loadProducts(true);
    }, [categoryFilter, priceFilter]);

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto space-y-8" id="catalog">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                     <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Catálogo de Presentes</h2>
                     <p className="text-slate-500">Explore nossa seleção curada com IA.</p>
                </div>
                
                <div className="flex gap-4">
                     <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px] bg-white border-slate-200">
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas Categorias</SelectItem>
                            <SelectItem value="Tech">Tecnologia</SelectItem>
                            <SelectItem value="Home">Casa & Decor</SelectItem>
                            <SelectItem value="Kitchen">Cozinha</SelectItem>
                            <SelectItem value="Books">Livros</SelectItem>
                            <SelectItem value="Fitness">Fitness</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                        <SelectTrigger className="w-[180px] bg-white border-slate-200">
                            <SelectValue placeholder="Preço" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Qualquer Preço</SelectItem>
                            <SelectItem value="<=50">Até R$50</SelectItem>
                            <SelectItem value="<=100">Até R$100</SelectItem>
                            <SelectItem value="100-200">R$100 - R$200</SelectItem>
                            <SelectItem value="200+">Acima de R$200</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {loading && (
                <div className="flex justify-center py-12">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            )}

            {!loading && hasMore && (
                <div className="flex justify-center pt-8">
                     <Button 
                        onClick={() => loadProducts(false)} 
                        variant="outline" 
                        size="lg"
                        className="rounded-full px-8"
                    >
                        Carregar Mais Presentes
                     </Button>
                </div>
            )}
            
            {!loading && products.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                    Nenhum produto encontrado com esses filtros.
                </div>
            )}
        </section>
    );
}
