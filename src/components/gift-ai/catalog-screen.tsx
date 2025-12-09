
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


import { ProductCard } from "@/components/gift-ai/product-card";

export function CatalogScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product => {
     const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.category?.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
     // Simple price filter logic for demo
     let matchesPrice = true;
     const price = Number(product.price) / 100;
     if (priceFilter === "low") matchesPrice = price < 50;
     if (priceFilter === "medium") matchesPrice = price >= 50 && price <= 150;
     if (priceFilter === "high") matchesPrice = price > 150;

     return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Catálogo de Presentes</h1>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <input 
                    type="text" 
                    placeholder="Buscar produtos..." 
                    className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Electronics">Eletrônicos</SelectItem>
                    <SelectItem value="Books">Livros</SelectItem>
                    <SelectItem value="Home">Casa</SelectItem>
                    <SelectItem value="Fashion">Moda</SelectItem>
                </SelectContent>
            </Select>

             <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Preço" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Qualquer</SelectItem>
                    <SelectItem value="low">Até R$ 50</SelectItem>
                    <SelectItem value="medium">R$ 50 - R$ 150</SelectItem>
                    <SelectItem value="high">Acima de R$ 150</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
                <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      )}
    </div>
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
