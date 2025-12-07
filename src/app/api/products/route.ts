
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { like, eq, and, sql, desc } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Query Params
        const category = searchParams.get('category');
        const priceBucket = searchParams.get('price_bucket');
        const search = searchParams.get('q');
        const limitParam = searchParams.get('limit') || '50';
        const offsetParam = searchParams.get('offset') || '0';
        
        const limit = parseInt(limitParam);
        const offset = parseInt(offsetParam);

        // Build Conditions
        const conditions = [];
        if (category) {
            conditions.push(like(products.category, `%${category}%`));
        }
        if (priceBucket) {
            conditions.push(eq(products.priceBucket, priceBucket));
        }
        if (search) {
             conditions.push(like(products.title, `%${search}%`));
        }

        // Execute Query
        const data = await db.select()
            .from(products)
            .where(and(...conditions))
            .limit(limit)
            .offset(offset)
            .orderBy(desc(products.createdAt));

        // Get Total Count (for pagination)
        // Note: Drizzle count with where clause is verbose, doing simple approx or separate query
        // const total = await db.select({ count: sql`count(*)` }).from(products).where(and(...conditions)); 
        // For simplicity returning result + metadata only if needed, or just array for v1.
        
        return NextResponse.json({
            count: data.length,
            limit,
            offset,
            products: data
        });

    } catch (e: any) {
        console.error("API Error:", e);
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}
