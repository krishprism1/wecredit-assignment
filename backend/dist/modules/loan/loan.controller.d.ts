import { Request, Response, NextFunction } from 'express';
export declare class LoanController {
    private loanService;
    createLoan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLoan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listLoans: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateLoan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    submitLoan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
