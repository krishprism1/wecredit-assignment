import { Request, Response, NextFunction } from 'express';
export declare class ProfileController {
    private profileService;
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateAddress: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateEmployment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
