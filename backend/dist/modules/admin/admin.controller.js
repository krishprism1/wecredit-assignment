"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_js_1 = require("./admin.service.js");
class AdminController {
    adminService = new admin_service_js_1.AdminService();
    listApplications = async (req, res, next) => {
        try {
            const { status, loan_type, search, limit, page } = req.query;
            const result = await this.adminService.listApplications({
                status,
                loan_type,
                search,
                limit: Number(limit),
                page: Number(page),
            });
            const response = {
                success: true,
                data: result,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    getApplicationDetails = async (req, res, next) => {
        try {
            const result = await this.adminService.getApplicationDetails(req.params.id);
            const response = {
                success: true,
                data: result,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    startReview = async (req, res, next) => {
        try {
            const adminId = req.user.id;
            const { remarks } = req.body;
            const result = await this.adminService.startReview(adminId, req.params.id, remarks);
            const response = {
                success: true,
                data: result,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    approveApplication = async (req, res, next) => {
        try {
            const adminId = req.user.id;
            const { remarks } = req.body;
            const result = await this.adminService.approveApplication(adminId, req.params.id, remarks);
            const response = {
                success: true,
                data: result,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    rejectApplication = async (req, res, next) => {
        try {
            const adminId = req.user.id;
            const { remarks } = req.body;
            const result = await this.adminService.rejectApplication(adminId, req.params.id, remarks);
            const response = {
                success: true,
                data: result,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    disburseLoan = async (req, res, next) => {
        try {
            const adminId = req.user.id;
            const { remarks } = req.body;
            const result = await this.adminService.disburseLoan(adminId, req.params.id, remarks);
            const response = {
                success: true,
                data: result,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    getDashboardStats = async (req, res, next) => {
        try {
            const result = await this.adminService.getDashboardStats();
            const response = {
                success: true,
                data: result,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    getAuditLogs = async (req, res, next) => {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 50;
            const result = await this.adminService.getAuditLogs(limit);
            const response = {
                success: true,
                data: result,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map