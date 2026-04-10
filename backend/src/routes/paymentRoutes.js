import express from 'express';
import {
  createPayment,
  getPayments,
  getPaymentById
} from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, createPayment);
router.get('/', requireAuth, getPayments);
router.get('/:id', requireAuth, getPaymentById);

export default router;
