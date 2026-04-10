import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/crud/userCrudController.js';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest
} from '../controllers/crud/requestCrudController.js';
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment
} from '../controllers/crud/paymentCrudController.js';

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.post('/requests', createRequest);
router.get('/requests', getRequests);
router.get('/requests/:id', getRequestById);
router.put('/requests/:id', updateRequest);
router.patch('/requests/:id', updateRequest);
router.delete('/requests/:id', deleteRequest);

router.post('/payments', createPayment);
router.get('/payments', getPayments);
router.get('/payments/:id', getPaymentById);
router.put('/payments/:id', updatePayment);
router.patch('/payments/:id', updatePayment);
router.delete('/payments/:id', deletePayment);

export default router;
