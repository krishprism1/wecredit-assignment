// backend/src/modules/profile/profile.repository.ts
import { supabaseAdmin } from '../../config/supabase.js';
import { Profile, Address, EmploymentDetails } from 'shared';

export class ProfileRepository {
  async getProfileById(userId: string): Promise<(Profile & { addresses?: Address[]; employment?: EmploymentDetails | null }) | null> {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) return null;

    const { data: addresses } = await supabaseAdmin
      .from('addresses')
      .select('*')
      .eq('profile_id', userId);

    const { data: employment } = await supabaseAdmin
      .from('employment_details')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle();

    return {
      ...profile,
      addresses: addresses || [],
      employment: employment || null,
    };
  }

  async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update(data)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return updatedProfile;
  }

  async upsertAddress(userId: string, data: Omit<Address, 'id' | 'profile_id' | 'created_at' | 'updated_at'>): Promise<Address> {
    // Check if an address of this type already exists
    const { data: existingAddress } = await supabaseAdmin
      .from('addresses')
      .select('id')
      .eq('profile_id', userId)
      .eq('address_type', data.address_type)
      .maybeSingle();

    let query;
    if (existingAddress) {
      query = supabaseAdmin
        .from('addresses')
        .update(data)
        .eq('id', existingAddress.id);
    } else {
      query = supabaseAdmin
        .from('addresses')
        .insert({
          profile_id: userId,
          ...data,
        });
    }

    const { data: result, error } = await query.select().single();
    if (error) throw error;
    return result;
  }

  async upsertEmployment(userId: string, data: Omit<EmploymentDetails, 'id' | 'profile_id' | 'created_at' | 'updated_at'>): Promise<EmploymentDetails> {
    const { data: result, error } = await supabaseAdmin
      .from('employment_details')
      .upsert({
        profile_id: userId,
        ...data,
      }, { onConflict: 'profile_id' })
      .select()
      .single();

    if (error) throw error;
    return result;
  }
}
