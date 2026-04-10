import express from 'express';
import { getSystemSettingsHandler, updateSystemSettingsHandler } from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getSystemSettingsHandler);
router.post('/', requireAuth, requireRole('admin'), updateSystemSettingsHandler);
router.put('/', requireAuth, requireRole('admin'), updateSystemSettingsHandler);

export default router;
