"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const profile_service_js_1 = require("./profile.service.js");
class ProfileController {
    profileService = new profile_service_js_1.ProfileService();
    getProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const profile = await this.profileService.getProfile(userId);
            const response = {
                success: true,
                data: profile,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const updated = await this.profileService.updateProfile(userId, req.body);
            const response = {
                success: true,
                data: updated,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    updateAddress = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const address = await this.profileService.updateAddress(userId, req.body);
            const response = {
                success: true,
                data: address,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    updateEmployment = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const employment = await this.profileService.updateEmployment(userId, req.body);
            const response = {
                success: true,
                data: employment,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.controller.js.map