
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from '../src/lib/db';
import { products } from '../src/lib/db/schema';
import { sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// Configuration
const AFFILIATE_TAG = 'presentaiaai-20';

// Categories to crawl (Keywords to search)
const KEYWORDS = [
  'Tech Gadgets', 'Home Decor', 'Kitchen Accessories', 'Coffee', 
  'Running Gear', 'Fitness', 'Board Games', 'Books', 
  'Smart Home', 'Travel Accessories', 'Camping'
];

// Price Bucket Logic
function calculatePriceBucket(price: number): string {
  if (price <= 30) return '<=30';
  if (price <= 50) return '<=50';
  if (price <= 100) return '<=100';
  if (price <= 200) return '100-200';
  if (price > 500) return '500+';
  return '200+';
}

function generateRandomProduct(keyword: string, index: number) {
    const prices = [29.90, 49.90, 89.90, 150.00, 250.00, 550.00];
    const rawPrice = prices[Math.floor(Math.random() * prices.length)] + (Math.random() * 20);
    const priceCents = Math.round(rawPrice * 100);
    
    // Deterministic ish Fallback Image logic will be handled by UI if empty, 
    // but here we can simulate either no image or a placeholder URL.
    // For now, let's leave image empty or use a generic one to test UI fallbacks.
    const hasImage = Math.random() > 0.0; // 0% have images, force fallback for now (User wanted robust fallback)
    // Or set some real ones if we want.
    // Let's set NO image to verify fallback, or maybe 50/50.
    
    return {
        asin: `MOCK-${keyword.substring(0,3).toUpperCase()}-${index}-${Math.floor(Math.random()*10000)}`,
        title: `${keyword} Item Premium ${index} - Edição Especial`,
        shortDescription: `Esta é uma descrição simulada para o incrível produto de ${keyword}. Ótima opção de presente.`,
        category: keyword,
        price: priceCents, // Storing cents as integer
        priceBucket: calculatePriceBucket(rawPrice),
        imageUrl: hasImage ? `https://source.unsplash.com/random/400x400?${keyword}` : '', // Unsplash source is deprecated/unreliable, better use empty to force local fallback
        gender: 'unisex',
        tags: [keyword.toLowerCase(), 'presente', 'top-vendas'],
        lifestyleTags: [],
        affiliateLink: `https://www.amazon.com.br/s?k=${keyword}&tag=${AFFILIATE_TAG}`,
        isVerified: true,
        createdAt: new Date(),
    };
}

async function runSeeder() {
    console.log('Starting Synthetic Data Seeder (Apify Backup)...');
    
    let totalSaved = 0;

    for (const keyword of KEYWORDS) {
        console.log(`Generating items for: ${keyword}`);
        
        // Generate 50 items per keyword -> 11 * 50 = 550 items
        const items = Array.from({ length: 50 }).map((_, i) => generateRandomProduct(keyword, i));
        
        for (const item of items) {
            await db.insert(products)
                .values(item as any)
                .onConflictDoUpdate({
                    target: products.asin,
                    set: item
                });
            totalSaved++;
        }
    }

    console.log(`Seeding finished. Total products upserted: ${totalSaved}`);
}

runSeeder().catch(console.error);
