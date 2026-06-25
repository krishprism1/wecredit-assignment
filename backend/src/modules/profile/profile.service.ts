import { ProfileRepository } from './profile.repository.js';
import { NotFoundError } from '../../shared/errors/app-error.js';
import { Address, EmploymentDetails, Profile } from 'shared';

export class ProfileService {
  private profileRepository = new ProfileRepository();

  async getProfile(userId: string) {
    const profile = await this.profileRepository.getProfileById(userId);
    if (!profile) {
      throw new NotFoundError('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, data: Partial<Profile>) {
    // Ensure profile exists
    await this.getProfile(userId);
    return this.profileRepository.updateProfile(userId, data);
  }

  async updateAddress(userId: string, data: Omit<Address, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) {
    await this.getProfile(userId);
    return this.profileRepository.upsertAddress(userId, data);
  }

  async updateEmployment(userId: string, data: Omit<EmploymentDetails, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) {
    await this.getProfile(userId);
    return this.profileRepository.upsertEmployment(userId, data);
  }
}
