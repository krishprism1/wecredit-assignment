"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("./auth.service.js");
class AuthController {
    authService = new auth_service_js_1.AuthService();
    register = async (req, res, next) => {
        try {
            const { email, password, full_name } = req.body;
            const result = await this.authService.register(email, password, full_name);
            const response = {
                success: true,
                data: result,
            };
            res.status(201).json(response);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
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
    logout = async (req, res, next) => {
        try {
            const token = req.token;
            await this.authService.logout(token);
            const response = {
                success: true,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map