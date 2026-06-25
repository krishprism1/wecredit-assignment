import { Router } from 'express';
import { ProfileController } from './profile.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  updateProfileSchema,
  updateAddressSchema,
  updateEmploymentSchema,
} from './profile.schemas.js';

const router = Router();
const controller = new ProfileController();

router.use(authenticate);

router.route('/')
  .get(controller.getProfile)
  .put(validate(updateProfileSchema), controller.updateProfile);

router.put('/address', validate(updateAddressSchema), controller.updateAddress);
router.put('/employment', validate(updateEmploymentSchema), controller.updateEmployment);

export default router;
