import { Request, Response, NextFunction } from 'express';
import { CreditService } from './credit.service.js';
import { ApiResponse } from 'shared';

export class CreditController {
  private creditService = new CreditService();

  getLatestScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const score = await this.creditService.getLatestScore(userId);
      const response: ApiResponse = {
        success: true,
        data: score,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  generateScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const score = await this.creditService.generateScore(userId);
      const response: ApiResponse = {
        success: true,
        data: score,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
