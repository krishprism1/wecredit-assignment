import { Profile, Address, EmploymentDetails } from 'shared';
export declare class ProfileRepository {
    getProfileById(userId: string): Promise<(Profile & {
        addresses?: Address[];
        employment?: EmploymentDetails | null;
    }) | null>;
    updateProfile(userId: string, data: Partial<Profile>): Promise<Profile>;
    upsertAddress(userId: string, data: Omit<Address, 'id' | 'profile_id' | 'created_at' | 'updated_at'>): Promise<Address>;
    upsertEmployment(userId: string, data: Omit<EmploymentDetails, 'id' | 'profile_id' | 'created_at' | 'updated_at'>): Promise<EmploymentDetails>;
}
