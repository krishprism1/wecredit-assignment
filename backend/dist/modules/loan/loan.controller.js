"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanController = void 0;
const loan_service_js_1 = require("./loan.service.js");
class LoanController {
    loanService = new loan_service_js_1.LoanService();
    createLoan = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const loan = await this.loanService.createLoan(userId, req.body);
            const response = {
                success: true,
                data: loan,
            };
            res.status(201).json(response);
        }
        catch (error) {
            next(error);
        }
    };
    getLoan = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const isAdmin = req.user.is_admin;
            const loan = await this.loanService.getLoan(userId, req.params.id, isAdmin);
            const response = {
                success: true,
                data: loan,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    listLoans = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const loans = await this.loanService.listLoans(userId);
            const response = {
                success: true,
                data: loans,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    updateLoan = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const loan = await this.loanService.updateLoan(userId, req.params.id, req.body);
            const response = {
                success: true,
                data: loan,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    submitLoan = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const loan = await this.loanService.submitLoan(userId, req.params.id);
            const response = {
                success: true,
                data: loan,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.LoanController = LoanController;
//# sourceMappingURL=loan.controller.js.map