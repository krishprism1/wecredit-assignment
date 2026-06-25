// backend/src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';


// Client initialized with anon key for user-specific operations (where we pass user JWT)
export const getSupabaseClient = (authHeader?: string) => {
  const options = authHeader
    ? {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    }
    : undefined;

  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, options);
};

// Client initialized with service role key for admin overrides (bypasses RLS)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
