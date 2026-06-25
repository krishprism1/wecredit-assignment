// frontend/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Global Supabase client for frontend-specific calls (e.g. auth listener or client-side storage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
