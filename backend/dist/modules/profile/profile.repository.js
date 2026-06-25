"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRepository = void 0;
const supabase_js_1 = require("../../config/supabase.js");
class ProfileRepository {
    async getProfileById(userId) {
        const { data: profile, error: profileError } = await supabase_js_1.supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (profileError || !profile)
            return null;
        const { data: addresses } = await supabase_js_1.supabaseAdmin
            .from('addresses')
            .select('*')
            .eq('profile_id', userId);
        const { data: employment } = await supabase_js_1.supabaseAdmin
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
    async updateProfile(userId, data) {
        const { data: updatedProfile, error } = await supabase_js_1.supabaseAdmin
            .from('profiles')
            .update(data)
            .eq('id', userId)
            .select()
            .single();
        if (error)
            throw error;
        return updatedProfile;
    }
    async upsertAddress(userId, data) {
        // Check if an address of this type already exists
        const { data: existingAddress } = await supabase_js_1.supabaseAdmin
            .from('addresses')
            .select('id')
            .eq('profile_id', userId)
            .eq('address_type', data.address_type)
            .maybeSingle();
        let query;
        if (existingAddress) {
            query = supabase_js_1.supabaseAdmin
                .from('addresses')
                .update(data)
                .eq('id', existingAddress.id);
        }
        else {
            query = supabase_js_1.supabaseAdmin
                .from('addresses')
                .insert({
                profile_id: userId,
                ...data,
            });
        }
        const { data: result, error } = await query.select().single();
        if (error)
            throw error;
        return result;
    }
    async upsertEmployment(userId, data) {
        const { data: result, error } = await supabase_js_1.supabaseAdmin
            .from('employment_details')
            .upsert({
            profile_id: userId,
            ...data,
        }, { onConflict: 'profile_id' })
            .select()
            .single();
        if (error)
            throw error;
        return result;
    }
}
exports.ProfileRepository = ProfileRepository;
//# sourceMappingURL=profile.repository.js.map