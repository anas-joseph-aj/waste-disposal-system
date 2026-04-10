import { ApiPayment } from '../models/api/ApiPayment.js';
import { ApiPickup } from '../models/api/ApiPickup.js';

function getId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function formatPayment(payment) {
  return {
    id: payment.id,
    userId: payment.userId,
    pickupRequestId: payment.pickupRequestId,
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    transactionId: payment.transactionId,
    reference: payment.reference || '',
    createdAt: payment.createdAt
  };
}

export async function createPayment(req, res, next) {
  try {
    const { amount, method, pickupRequestId, transactionId, reference } = req.body || {};

    if (!amount || !method) {
      return res.status(400).json({ message: 'amount and method are required' });
    }

    const status = ['CashOnDelivery', 'Cash on Delivery'].includes(method) ? 'Pending' : 'Paid';
    const payment = await ApiPayment.create({
      id: getId('pay'),
      userId: req.user.id,
      pickupRequestId: pickupRequestId || '',
      amount: Number(amount),
      method,
      status,
      transactionId: String(transactionId || `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`),
      reference: String(reference || ''),
      createdAt: new Date().toISOString()
    });

    if (pickupRequestId) {
      await ApiPickup.updateOne({ id: pickupRequestId }, { $set: { paymentId: payment.id, status: 'Pending' } });
    }

    return res.status(201).json({ message: 'Payment processed', payment: formatPayment(payment) });
  } catch (error) {
    next(error);
  }
}

export async function getPayments(req, res, next) {
  try {
    const { status, skip = 0, limit = 50 } = req.query;
    const query = {};

    if (req.user.role === 'user') {
      query.userId = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const start = Number(skip) || 0;
    const pageSize = Number(limit) || 50;

    const [payments, total] = await Promise.all([
      ApiPayment.find(query).sort({ createdAt: -1 }).skip(start).limit(pageSize),
      ApiPayment.countDocuments(query)
    ]);

    return res.json({ payments: payments.map((p) => formatPayment(p)), total });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentById(req, res, next) {
  try {
    const { id } = req.params;
    const payment = await ApiPayment.findOne({ id });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (req.user.role === 'user' && payment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    return res.json({ payment: formatPayment(payment) });
  } catch (error) {
    next(error);
  }
}
