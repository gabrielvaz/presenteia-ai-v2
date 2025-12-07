import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://placeholder:placeholder@localhost:5432/placeholder';

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL is missing. Using placeholder connection.');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
