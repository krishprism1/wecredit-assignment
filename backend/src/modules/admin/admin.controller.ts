import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service.js';
import { ApiResponse } from 'shared';

export class AdminController {
  private adminService = new AdminService();

  listApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, loan_type, search, limit, page } = req.query as any;
      const result = await this.adminService.listApplications({
        status,
        loan_type,
        search,
        limit: Number(limit),
        page: Number(page),
      });
      const response: ApiResponse = {
        success: true,
        data: result,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getApplicationDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adminService.getApplicationDetails(req.params.id);
      const response: ApiResponse = {
        success: true,
        data: result,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  startReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.id;
      const { remarks } = req.body;
      const result = await this.adminService.startReview(adminId, req.params.id, remarks);
      const response: ApiResponse = {
        success: true,
        data: result,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  approveApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.id;
      const { remarks } = req.body;
      const result = await this.adminService.approveApplication(adminId, req.params.id, remarks);
      const response: ApiResponse = {
        success: true,
        data: result,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  rejectApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.id;
      const { remarks } = req.body;
      const result = await this.adminService.rejectApplication(adminId, req.params.id, remarks);
      const response: ApiResponse = {
        success: true,
        data: result,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  disburseLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user!.id;
      const { remarks } = req.body;
      const result = await this.adminService.disburseLoan(adminId, req.params.id, remarks);
      const response: ApiResponse = {
        success: true,
        data: result,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adminService.getDashboardStats();
      const response: ApiResponse = {
        success: true,
        data: result,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const result = await this.adminService.getAuditLogs(limit);
      const response: ApiResponse = {
        success: true,
        data: result,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
