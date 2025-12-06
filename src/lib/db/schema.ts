import { pgTable, text, serial, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  asin: text('asin').unique(),
  title: text('title').notNull(),
  description: text('description'), // Optional now
  priceRange: text('price_range').notNull(), 
  category: text('category').notNull(),
  imageUrl: text('image_url').notNull(),
  affiliateLink: text('affiliate_link').notNull(),
  interestTags: text('interest_tags').array(), // using Postgres array
  isVerified: boolean('is_verified').default(false),
  currency: text('currency').default('BRL'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
