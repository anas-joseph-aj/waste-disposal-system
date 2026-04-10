import express from 'express';
import {
  getAllUsers,
  getCollectors,
  getUserById,
  updateProfile,
  changePassword,
  deleteUser,
  createUser
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('admin'), createUser);
router.get('/', requireAuth, requireRole('admin'), getAllUsers);
router.get('/collectors', requireAuth, requireRole('admin'), getCollectors);
router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));
router.get('/:id', requireAuth, getUserById);
router.put('/:id/profile', requireAuth, updateProfile);
router.put('/:id/password', requireAuth, changePassword);
router.delete('/:id', requireAuth, requireRole('admin'), deleteUser);

export default router;
