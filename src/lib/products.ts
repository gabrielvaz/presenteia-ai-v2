import { db } from './db';
import { products } from './db/schema';
import { GiftSuggestion } from "./types";
import { like, or } from 'drizzle-orm';

// Fallback data in case DB connection is missing during demo
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: 'Kindle Paperwhite',
    description: 'The best e-reader for book lovers, waterproof and with adjustable warm light.',
    priceRange: '$140',
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/51p4a-eJalL._AC_SX679_.jpg',
    affiliateLink: 'https://www.amazon.com/dp/B08KTZ8249?tag=gift-ai-20',
    interestTags: ['Reading', 'Books', 'Tech'],
    isVerified: true
  },
  {
    id: 2,
    title: 'Hario V60 Ceramic Coffee Dripper',
    description: 'Classic pour-over coffee maker for the perfect morning brew.',
    priceRange: '$25',
    category: 'Home & Kitchen',
    imageUrl: 'https://m.media-amazon.com/images/I/61u0y9ADLpL._AC_SX679_.jpg',
    affiliateLink: 'https://www.amazon.com/dp/B000P4D5HG?tag=gift-ai-20',
    interestTags: ['Coffee', 'Brewing', 'Home'],
    isVerified: true
  },
  {
    id: 3,
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling headphones for deep focus and music.',
    priceRange: '$348',
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SX679_.jpg',
    affiliateLink: 'https://www.amazon.com/dp/B09XS7JWHH?tag=gift-ai-20',
    interestTags: ['Music', 'Audio', 'Tech', 'Travel'],
    isVerified: true
  },
  {
    id: 4,
    title: 'Stanley Quencher H2.0 FlowState Tumbler',
    description: 'The viral tumbler that keeps water cold for hours. Perfect for hydration.',
    priceRange: '$45',
    category: 'Home & Kitchen',
    imageUrl: 'https://m.media-amazon.com/images/I/61KqW9-1CGL._AC_SX679_.jpg',
    affiliateLink: 'https://www.amazon.com/dp/B0BQZDRQPW?tag=gift-ai-20',
    interestTags: ['Hydration', 'Lifestyle', 'Work'],
    isVerified: true
  },
  {
    id: 5,
    title: 'Moleskine Classic Notebook',
    description: 'A reliable travel companion, perfect for writings, thoughts and passing notes.',
    priceRange: '$20',
    category: 'Stationery',
    imageUrl: 'https://m.media-amazon.com/images/I/61Z6sS103RL._AC_SX679_.jpg',
    affiliateLink: 'https://www.amazon.com/dp/B001TUYW4O?tag=gift-ai-20',
    interestTags: ['Writing', 'Notes', 'Office'],
    isVerified: true
  }
];

export async function searchProducts(interests: string[], budget: string = 'medium'): Promise<GiftSuggestion[]> {
  try {
    // If we have a DB connection, try to query it
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql')) {
      const allProducts = await db.select().from(products);
      
      const matched = allProducts.filter(p => {
         // Check explicit tags first if available
         if (p.interestTags && p.interestTags.length > 0) {
             const tagMatch = p.interestTags.some(tag => 
                 interests.some(i => tag?.toLowerCase().includes(i.toLowerCase()))
             );
             if (tagMatch) return true;
         }
         
         // Fallback to text search
         return interests.some(i => 
             p.title.toLowerCase().includes(i.toLowerCase()) || 
             p.category.toLowerCase().includes(i.toLowerCase()) ||
             (p.description && p.description.toLowerCase().includes(i.toLowerCase()))
         );
      });
      
      // If no matches (or empty DB), return fallback or mix
      const source = matched.length > 0 ? matched : allProducts;
      
      return source.map(p => ({
          id: String(p.id),
          title: p.title,
          description: p.description || p.title, // Handle nullable description
          reason: `Matched with interests: ${interests.join(', ')}`,
          priceRange: p.priceBucket || 'Ver preço',
          priceBucket: p.priceBucket || undefined,
          price: p.price || 0,
          category: p.category,
          imageUrl: p.imageUrl || undefined,
          affiliateLink: p.affiliateLink
      })).slice(0, 5);
    }
    throw new Error("No DB");
  } catch (err) {
    console.warn("Database error or missing URL, using fallback data:", err);

    return FALLBACK_PRODUCTS.map(p => ({
        id: String(p.id),
        title: p.title,
        description: p.description,
        reason: "Recommended based on general popularity (Demo Mode)",
        priceRange: p.priceRange,
        category: p.category,
        imageUrl: p.imageUrl,
        affiliateLink: p.affiliateLink
    }));
  }
}

export async function getAllProducts() {
    try {
        if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql')) {
            return await db.select().from(products);
        }
        return FALLBACK_PRODUCTS.map(p => ({
             ...p,
             asin: 'MOCK'+p.id,
             currency: 'BRL',
             createdAt: new Date(),
             description: p.description,
             interestTags: p.interestTags
        })); 
    } catch(e) {
        console.warn("DB Failed, returning fallback");
        return FALLBACK_PRODUCTS.map(p => ({
             ...p,
             asin: 'MOCK'+p.id,
             currency: 'BRL',
             createdAt: new Date(),
             description: p.description,
             interestTags: p.interestTags
        }));
    }
}
