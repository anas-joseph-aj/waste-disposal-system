import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import pickupRoutes from './pickupRoutes.js';
import complaintRoutes from './complaintRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import chatbotRoutes from './chatbotRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import crudRoutes from './crudRoutes.js';
import v2Routes from './v2/index.js';

const router = express.Router();

router.options('*', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/pickups', pickupRoutes);
router.use('/complaints', complaintRoutes);
router.use('/payments', paymentRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/settings', settingsRoutes);
router.use('/crud', crudRoutes);
router.use('/v2', v2Routes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'waste-disposal-system-api' });
});

export default router;
