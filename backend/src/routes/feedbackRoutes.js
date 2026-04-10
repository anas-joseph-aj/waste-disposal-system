import express from 'express';
import {
  createFeedback,
  getFeedback,
  getPublicApprovedFeedback,
  moderateFeedback
} from '../controllers/feedbackController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/public', getPublicApprovedFeedback);
router.post('/', requireAuth, createFeedback);
router.get('/', requireAuth, getFeedback);
router.put('/:id/moderate', requireAuth, requireRole('admin'), moderateFeedback);

export default router;
