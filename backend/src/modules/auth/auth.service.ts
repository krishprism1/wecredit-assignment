import { supabaseAdmin } from '../../config/supabase.js';
import { BadRequestError, UnauthorizedError } from '../../shared/errors/app-error.js';
import { AuthResponseData } from 'shared';

export class AuthService {
  async register(email: string, password: string, fullName: string): Promise<AuthResponseData> {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      throw new BadRequestError(error.message);
    }

    if (!data.user) {
      throw new BadRequestError('User registration failed');
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name, is_admin')
      .eq('id', data.user.id)
      .single();

    const { data: loginData, error: loginError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) throw loginError;

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

  async login(email: string, password: string): Promise<AuthResponseData> {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!data.user || !data.session) {
      throw new UnauthorizedError('Authentication failed');
    }

    const { data: profile } = await supabaseAdmin
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

  async logout(token: string): Promise<void> {
    const { error } = await supabaseAdmin.auth.admin.signOut(token);
    if (error) {
      throw new BadRequestError(error.message);
    }
  }
}
