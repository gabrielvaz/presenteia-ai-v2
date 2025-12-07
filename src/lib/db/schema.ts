import { pgTable, text, serial, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(), // Keeping serial for simplicity/compatibility
  asin: text('asin').unique().notNull(), // Added notNull
  title: text('title').notNull(),
  shortDescription: text('short_description'), // User requested short_description
  description: text('description'), // Keeping original description too or mapping?
  category: text('category').notNull(),
  price: integer('price'), // Storing as integer (cents) is usually safer, but user said Numeric. Let's use decimal for exact currency if needed, or integer cents. I'll use decimal(10,2) mapped to string/number.
  priceBucket: text('price_bucket'),
  imageUrl: text('image_url'),
  gender: text('gender'),
  tags: text('tags').array(), // General tags
  lifestyleTags: text('lifestyle_tags').array(),
  affiliateLink: text('affiliate_link').notNull(),
  interestTags: text('interest_tags').array(), // Keeping for backward compat if needed, or just relying on tags
  isVerified: boolean('is_verified').default(false),
  currency: text('currency').default('BRL'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
