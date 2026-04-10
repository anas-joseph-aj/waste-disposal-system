import mongoose from 'mongoose';
import Payment from '../../models/Payment.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function createPayment(req, res, next) {
  try {
    const { userId, requestId, amount, paymentMethod, paymentStatus, transactionId, paidAt } = req.body || {};

    if (!userId || !requestId || amount === undefined) {
      return res.status(400).json({ message: 'userId, requestId and amount are required.' });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid userId.' });
    }

    if (!isValidObjectId(requestId)) {
      return res.status(400).json({ message: 'Invalid requestId.' });
    }

    const payment = await Payment.create({
      userId,
      requestId,
      amount: Number(amount),
      paymentMethod: paymentMethod ? String(paymentMethod).trim() : undefined,
      paymentStatus,
      transactionId: transactionId ? String(transactionId).trim() : undefined,
      paidAt: paidAt ? new Date(paidAt) : undefined
    });

    return res.status(201).json({ message: 'Payment created successfully.', payment });
  } catch (error) {
    return next(error);
  }
}

export async function getPayments(req, res, next) {
  try {
    const { userId, requestId, paymentStatus, page = 1, limit = 20 } = req.query;
    const query = {};

    if (userId) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid userId.' });
      }
      query.userId = userId;
    }

    if (requestId) {
      if (!isValidObjectId(requestId)) {
        return res.status(400).json({ message: 'Invalid requestId.' });
      }
      query.requestId = requestId;
    }

    if (paymentStatus) {
      query.paymentStatus = String(paymentStatus);
    }

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (currentPage - 1) * pageSize;

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('userId', 'name email role')
        .populate('requestId', 'wasteType status pickupDate pickupTime')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Payment.countDocuments(query)
    ]);

    return res.json({
      payments,
      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPaymentById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid payment id.' });
    }

    const payment = await Payment.findById(id)
      .populate('userId', 'name email role')
      .populate('requestId', 'wasteType status pickupDate pickupTime');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    return res.json({ payment });
  } catch (error) {
    return next(error);
  }
}

export async function updatePayment(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid payment id.' });
    }

    const { userId, requestId, amount, paymentMethod, paymentStatus, transactionId, paidAt } = req.body || {};
    const updates = {};

    if (userId !== undefined) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid userId.' });
      }
      updates.userId = userId;
    }

    if (requestId !== undefined) {
      if (!isValidObjectId(requestId)) {
        return res.status(400).json({ message: 'Invalid requestId.' });
      }
      updates.requestId = requestId;
    }

    if (amount !== undefined) updates.amount = Number(amount);
    if (paymentMethod !== undefined) updates.paymentMethod = String(paymentMethod).trim();
    if (paymentStatus !== undefined) updates.paymentStatus = String(paymentStatus);
    if (transactionId !== undefined) updates.transactionId = String(transactionId).trim();
    if (paidAt !== undefined) updates.paidAt = paidAt ? new Date(paidAt) : null;

    const payment = await Payment.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    })
      .populate('userId', 'name email role')
      .populate('requestId', 'wasteType status pickupDate pickupTime');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    return res.json({ message: 'Payment updated successfully.', payment });
  } catch (error) {
    return next(error);
  }
}

export async function deletePayment(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid payment id.' });
    }

    const payment = await Payment.findByIdAndDelete(id).lean();
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    return res.json({ message: 'Payment deleted successfully.' });
  } catch (error) {
    return next(error);
  }
}
