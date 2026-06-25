"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = exports.getSupabaseClient = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_js_1 = require("./env.js");
// Client initialized with anon key for user-specific operations (where we pass user JWT)
const getSupabaseClient = (authHeader) => {
    const options = authHeader
        ? {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
        : undefined;
    return (0, supabase_js_1.createClient)(env_js_1.env.SUPABASE_URL, env_js_1.env.SUPABASE_ANON_KEY, options);
};
exports.getSupabaseClient = getSupabaseClient;
// Client initialized with service role key for admin overrides (bypasses RLS)
exports.supabaseAdmin = (0, supabase_js_1.createClient)(env_js_1.env.SUPABASE_URL, env_js_1.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});
//# sourceMappingURL=supabase.js.map