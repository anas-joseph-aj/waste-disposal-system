import express from 'express';
import {
  createPickup,
  getPickups,
  getPickupById,
  updatePickupStatus,
  assignCollector,
  deletePickup
} from '../controllers/pickupController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, createPickup);
router.get('/', requireAuth, getPickups);
router.get('/:id', requireAuth, getPickupById);
router.put('/:id/status', requireAuth, updatePickupStatus);
router.put('/:id/assign', requireAuth, requireRole('admin'), assignCollector);
router.delete('/:id', requireAuth, requireRole('admin'), deletePickup);

export default router;
