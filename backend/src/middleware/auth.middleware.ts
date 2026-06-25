// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, InternalServerError } from '../shared/errors/app-error.js';
import { supabaseAdmin } from '../config/supabase.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        full_name: string | null;
        is_admin: boolean;
      };
      token?: string;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Missing or invalid Authorization header'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(new UnauthorizedError('Missing token'));
    }

    // Get user from Supabase Auth using the JWT token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return next(new UnauthorizedError('Invalid or expired token'));
    }

    // Retrieve profile for is_admin check and other user data
    const { data: profile, error: dbError } = await supabaseAdmin
      .from('profiles')
      .select('full_name, is_admin')
      .eq('id', user.id)
      .single();

    if (dbError) {
      // If profile doesn't exist, try to create it or throw error
      // Note: Triggers on auth.users should have created it, but in case of delay/race conditions:
      return next(new InternalServerError('Failed to retrieve user profile'));
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      full_name: profile?.full_name || '',
      is_admin: profile?.is_admin || false,
    };
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};
