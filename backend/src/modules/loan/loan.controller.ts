// backend/src/modules/loan/loan.controller.ts
import { Request, Response, NextFunction } from 'express';
import { LoanService } from './loan.service.js';
import { ApiResponse } from 'shared';

export class LoanController {
  private loanService = new LoanService();

  createLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const loan = await this.loanService.createLoan(userId, req.body);
      const response: ApiResponse = {
        success: true,
        data: loan,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const isAdmin = req.user!.is_admin;
      const loan = await this.loanService.getLoan(userId, req.params.id, isAdmin);
      const response: ApiResponse = {
        success: true,
        data: loan,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  listLoans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const loans = await this.loanService.listLoans(userId);
      const response: ApiResponse = {
        success: true,
        data: loans,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  updateLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const loan = await this.loanService.updateLoan(userId, req.params.id, req.body);
      const response: ApiResponse = {
        success: true,
        data: loan,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  submitLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const loan = await this.loanService.submitLoan(userId, req.params.id);
      const response: ApiResponse = {
        success: true,
        data: loan,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
