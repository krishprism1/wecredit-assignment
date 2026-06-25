"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditController = void 0;
const credit_service_js_1 = require("./credit.service.js");
class CreditController {
    creditService = new credit_service_js_1.CreditService();
    getLatestScore = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const score = await this.creditService.getLatestScore(userId);
            const response = {
                success: true,
                data: score,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
    generateScore = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const score = await this.creditService.generateScore(userId);
            const response = {
                success: true,
                data: score,
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CreditController = CreditController;
//# sourceMappingURL=credit.controller.js.map