import { Address, EmploymentDetails, Profile } from 'shared';
export declare class ProfileService {
    private profileRepository;
    getProfile(userId: string): Promise<Profile & {
        addresses?: Address[];
        employment?: EmploymentDetails | null;
    }>;
    updateProfile(userId: string, data: Partial<Profile>): Promise<Profile>;
    updateAddress(userId: string, data: Omit<Address, 'id' | 'profile_id' | 'created_at' | 'updated_at'>): Promise<Address>;
    updateEmployment(userId: string, data: Omit<EmploymentDetails, 'id' | 'profile_id' | 'created_at' | 'updated_at'>): Promise<EmploymentDetails>;
}
