import express from 'express';
import { register, login, getCurrentUser, checkEmail, resetPassword } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.post('/reset-password', resetPassword);
router.get('/me', requireAuth, getCurrentUser);

export default router;
