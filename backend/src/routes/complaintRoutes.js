import express from 'express';
import {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint
} from '../controllers/complaintController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, createComplaint);
router.get('/', requireAuth, getComplaints);
router.put('/:id/status', requireAuth, requireRole('admin'), updateComplaintStatus);
router.delete('/:id', requireAuth, requireRole('admin'), deleteComplaint);

export default router;
