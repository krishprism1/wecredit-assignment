import { Request, Response, NextFunction } from 'express';
export declare class CreditController {
    private creditService;
    getLatestScore: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    generateScore: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
