"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const app_error_js_1 = require("../shared/errors/app-error.js");
const supabase_js_1 = require("../config/supabase.js");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new app_error_js_1.UnauthorizedError('Missing or invalid Authorization header'));
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(new app_error_js_1.UnauthorizedError('Missing token'));
        }
        // Get user from Supabase Auth using the JWT token
        const { data: { user }, error: authError } = await supabase_js_1.supabaseAdmin.auth.getUser(token);
        if (authError || !user) {
            return next(new app_error_js_1.UnauthorizedError('Invalid or expired token'));
        }
        // Retrieve profile for is_admin check and other user data
        const { data: profile, error: dbError } = await supabase_js_1.supabaseAdmin
            .from('profiles')
            .select('full_name, is_admin')
            .eq('id', user.id)
            .single();
        if (dbError) {
            return next(new app_error_js_1.InternalServerError('Failed to retrieve user profile'));
        }
        req.user = {
            id: user.id,
            email: user.email || '',
            full_name: profile?.full_name || '',
            is_admin: profile?.is_admin || false,
        };
        req.token = token;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map