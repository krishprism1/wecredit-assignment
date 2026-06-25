import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  reviewActionSchema,
  rejectActionSchema,
  queryApplicationsSchema,
} from './admin.schemas.js';

const router = Router();
const controller = new AdminController();

router.use(authenticate, requireAdmin);

router.get('/dashboard', controller.getDashboardStats);
router.get('/audit-logs', controller.getAuditLogs);

router.get('/applications', validate(queryApplicationsSchema), controller.listApplications);
router.get('/applications/:id', controller.getApplicationDetails);

router.post('/applications/:id/review', validate(reviewActionSchema), controller.startReview);
router.post('/applications/:id/approve', validate(reviewActionSchema), controller.approveApplication);
router.post('/applications/:id/reject', validate(rejectActionSchema), controller.rejectApplication);
router.post('/applications/:id/disburse', validate(reviewActionSchema), controller.disburseLoan);

export default router;
