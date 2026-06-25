import { Request, Response, NextFunction } from 'express';
import { ProfileService } from './profile.service.js';
import { ApiResponse } from 'shared';

export class ProfileController {
  private profileService = new ProfileService();

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const profile = await this.profileService.getProfile(userId);
      const response: ApiResponse = {
        success: true,
        data: profile,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const updated = await this.profileService.updateProfile(userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: updated,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const address = await this.profileService.updateAddress(userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: address,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  updateEmployment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const employment = await this.profileService.updateEmployment(userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: employment,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
