import { Router } from 'express';
import { LoanController } from './loan.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createLoanSchema, updateLoanSchema } from './loan.schemas.js';

const router = Router();
const controller = new LoanController();

router.use(authenticate);

router.route('/')
  .get(controller.listLoans)
  .post(validate(createLoanSchema), controller.createLoan);

router.route('/:id')
  .get(controller.getLoan)
  .put(validate(updateLoanSchema), controller.updateLoan);

router.post('/:id/submit', controller.submitLoan);

export default router;
