"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const profile_repository_js_1 = require("./profile.repository.js");
const app_error_js_1 = require("../../shared/errors/app-error.js");
class ProfileService {
    profileRepository = new profile_repository_js_1.ProfileRepository();
    async getProfile(userId) {
        const profile = await this.profileRepository.getProfileById(userId);
        if (!profile) {
            throw new app_error_js_1.NotFoundError('Profile not found');
        }
        return profile;
    }
    async updateProfile(userId, data) {
        // Ensure profile exists
        await this.getProfile(userId);
        return this.profileRepository.updateProfile(userId, data);
    }
    async updateAddress(userId, data) {
        await this.getProfile(userId);
        return this.profileRepository.upsertAddress(userId, data);
    }
    async updateEmployment(userId, data) {
        await this.getProfile(userId);
        return this.profileRepository.upsertEmployment(userId, data);
    }
}
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map