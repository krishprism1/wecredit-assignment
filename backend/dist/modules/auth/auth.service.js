"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const supabase_js_1 = require("../../config/supabase.js");
const app_error_js_1 = require("../../shared/errors/app-error.js");
class AuthService {
    async register(email, password, fullName) {
        const { data, error } = await supabase_js_1.supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });
        if (error) {
            throw new app_error_js_1.BadRequestError(error.message);
        }
        if (!data.user) {
            throw new app_error_js_1.BadRequestError('User registration failed');
        }
        // Fetch user profile
        const { data: profile } = await supabase_js_1.supabaseAdmin
            .from('profiles')
            .select('full_name, is_admin')
            .eq('id', data.user.id)
            .single();
        const { data: loginData, error: loginError } = await supabase_js_1.supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });
        if (loginError)
            throw loginError;
        return {
            user: {
                id: data.user.id,
                email: data.user.email || '',
                full_name: profile?.full_name || fullName,
                is_admin: profile?.is_admin || false,
            },
            token: loginData.session?.access_token || '',
        };
    }
    async login(email, password) {
        const { data, error } = await supabase_js_1.supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new app_error_js_1.UnauthorizedError('Invalid credentials');
        }
        if (!data.user || !data.session) {
            throw new app_error_js_1.UnauthorizedError('Authentication failed');
        }
        const { data: profile } = await supabase_js_1.supabaseAdmin
            .from('profiles')
            .select('full_name, is_admin')
            .eq('id', data.user.id)
            .single();
        return {
            user: {
                id: data.user.id,
                email: data.user.email || '',
                full_name: profile?.full_name || '',
                is_admin: profile?.is_admin || false,
            },
            token: data.session.access_token,
        };
    }
    async logout(token) {
        const { error } = await supabase_js_1.supabaseAdmin.auth.admin.signOut(token);
        if (error) {
            throw new app_error_js_1.BadRequestError(error.message);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map