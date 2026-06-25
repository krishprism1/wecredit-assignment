import { Request, Response, NextFunction } from 'express';
export declare class AdminController {
    private adminService;
    listApplications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getApplicationDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    startReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approveApplication: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    rejectApplication: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    disburseLoan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDashboardStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAuditLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
