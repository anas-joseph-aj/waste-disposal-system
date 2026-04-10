import { ApiFeedback } from '../models/api/ApiFeedback.js';
import { ApiPickup } from '../models/api/ApiPickup.js';
import { ApiUser } from '../models/api/ApiUser.js';

function getId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function formatFeedback(feedback, userName = '') {
  return {
    id: feedback.id,
    userId: feedback.userId,
    userName,
    pickupRequestId: feedback.pickupRequestId,
    rating: Number(feedback.rating || 0),
    comment: feedback.comment || '',
    moderationStatus: feedback.moderationStatus || 'Pending',
    moderatedBy: feedback.moderatedBy || '',
    moderatedAt: feedback.moderatedAt || '',
    adminNote: feedback.adminNote || '',
    createdAt: feedback.createdAt,
    updatedAt: feedback.updatedAt || feedback.createdAt
  };
}

function isPickupCompleted(pickup) {
  return String(pickup?.status || '').toLowerCase() === 'completed';
}

export async function createFeedback(req, res, next) {
  try {
    const { pickupRequestId, rating, comment = '' } = req.body || {};

    if (!pickupRequestId) {
      return res.status(400).json({ message: 'pickupRequestId is required' });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'rating must be an integer between 1 and 5' });
    }

    const pickup = await ApiPickup.findOne({ id: pickupRequestId });
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    if (req.user.role === 'user' && pickup.userId !== req.user.id) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    if (!isPickupCompleted(pickup)) {
      return res.status(400).json({ message: 'Feedback can be submitted only after pickup is completed' });
    }

    const existing = await ApiFeedback.findOne({ userId: req.user.id, pickupRequestId });
    if (existing) {
      existing.rating = numericRating;
      existing.comment = String(comment || '').trim();
      existing.moderationStatus = 'Pending';
      existing.moderatedBy = '';
      existing.moderatedAt = '';
      existing.adminNote = '';
      existing.updatedAt = new Date().toISOString();
      await existing.save();
      return res.json({ message: 'Feedback updated and sent for admin review', feedback: formatFeedback(existing) });
    }

    const feedback = await ApiFeedback.create({
      id: getId('fdb'),
      userId: req.user.id,
      pickupRequestId,
      rating: numericRating,
      comment: String(comment || '').trim(),
      moderationStatus: 'Pending',
      moderatedBy: '',
      moderatedAt: '',
      adminNote: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return res.status(201).json({ message: 'Feedback submitted and pending admin approval', feedback: formatFeedback(feedback) });
  } catch (error) {
    next(error);
  }
}

export async function getFeedback(req, res, next) {
  try {
    const { pickupRequestId, moderationStatus } = req.query;
    const query = {};

    if (pickupRequestId) {
      query.pickupRequestId = pickupRequestId;
    }

    if (moderationStatus) {
      query.moderationStatus = moderationStatus;
    }

    if (req.user.role === 'user') {
      query.userId = req.user.id;
    }

    const items = await ApiFeedback.find(query).sort({ updatedAt: -1, createdAt: -1 });

    const userIds = [...new Set(items.map((item) => String(item.userId || '')).filter(Boolean))];
    const users = userIds.length ? await ApiUser.find({ id: { $in: userIds } }).lean() : [];
    const userMap = new Map(users.map((user) => [String(user.id), user.name || 'User']));

    return res.json({
      feedback: items.map((item) => formatFeedback(item, userMap.get(String(item.userId || '')) || 'User'))
    });
  } catch (error) {
    next(error);
  }
}

export async function moderateFeedback(req, res, next) {
  try {
    const { id } = req.params;
    const { action, adminNote = '' } = req.body || {};

    if (!['approve', 'reject'].includes(String(action || '').toLowerCase())) {
      return res.status(400).json({ message: "action must be 'approve' or 'reject'" });
    }

    const feedback = await ApiFeedback.findOne({ id });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const normalizedAction = String(action).toLowerCase();
    feedback.moderationStatus = normalizedAction === 'approve' ? 'Approved' : 'Rejected';
    feedback.moderatedBy = String(req.user?.id || '');
    feedback.moderatedAt = new Date().toISOString();
    feedback.adminNote = String(adminNote || '').trim();
    feedback.updatedAt = new Date().toISOString();

    await feedback.save();

    return res.json({
      message: `Feedback ${normalizedAction === 'approve' ? 'approved' : 'rejected'} successfully`,
      feedback: formatFeedback(feedback)
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicApprovedFeedback(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number(req.query?.limit) || 8, 1), 30);

    const items = await ApiFeedback.find({ moderationStatus: 'Approved' })
      .sort({ moderatedAt: -1, updatedAt: -1 })
      .limit(limit);

    const userIds = [...new Set(items.map((item) => String(item.userId || '')).filter(Boolean))];
    const users = userIds.length ? await ApiUser.find({ id: { $in: userIds } }).lean() : [];
    const userMap = new Map(users.map((user) => [String(user.id), user.name || 'User']));

    return res.json({
      feedback: items.map((item) => formatFeedback(item, userMap.get(String(item.userId || '')) || 'User'))
    });
  } catch (error) {
    next(error);
  }
}
