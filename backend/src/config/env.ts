// backend/src/config/env.ts
import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:', result.error.format());
  process.exit(1);
}

export const env = result.data;
