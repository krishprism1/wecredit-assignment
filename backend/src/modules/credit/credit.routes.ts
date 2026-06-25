import { Router } from 'express';
import { CreditController } from './credit.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();
const controller = new CreditController();

router.use(authenticate);

router.route('/score')
  .get(controller.getLatestScore)
  .post(controller.generateScore);

export default router;
