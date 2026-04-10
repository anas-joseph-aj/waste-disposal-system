import mongoose from 'mongoose';
import Request from '../../models/Request.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function createRequest(req, res, next) {
  try {
    const { userId, wasteType, address, pickupDate, pickupTime, notes, status, collectorId } = req.body || {};

    if (!userId || !wasteType || !address || !pickupDate || !pickupTime) {
      return res
        .status(400)
        .json({ message: 'userId, wasteType, address, pickupDate and pickupTime are required.' });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid userId.' });
    }

    if (collectorId && !isValidObjectId(collectorId)) {
      return res.status(400).json({ message: 'Invalid collectorId.' });
    }

    const request = await Request.create({
      userId,
      wasteType: String(wasteType).trim(),
      address: String(address).trim(),
      pickupDate: String(pickupDate).trim(),
      pickupTime: String(pickupTime).trim(),
      notes: notes ? String(notes).trim() : undefined,
      status,
      collectorId: collectorId || null
    });

    return res.status(201).json({ message: 'Request created successfully.', request });
  } catch (error) {
    return next(error);
  }
}

export async function getRequests(req, res, next) {
  try {
    const { status, userId, collectorId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = String(status);
    if (userId) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid userId.' });
      }
      query.userId = userId;
    }
    if (collectorId) {
      if (!isValidObjectId(collectorId)) {
        return res.status(400).json({ message: 'Invalid collectorId.' });
      }
      query.collectorId = collectorId;
    }

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (currentPage - 1) * pageSize;

    const [requests, total] = await Promise.all([
      Request.find(query)
        .populate('userId', 'name email role')
        .populate('collectorId', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Request.countDocuments(query)
    ]);

    return res.json({
      requests,
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

export async function getRequestById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid request id.' });
    }

    const request = await Request.findById(id)
      .populate('userId', 'name email role')
      .populate('collectorId', 'name email role');

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    return res.json({ request });
  } catch (error) {
    return next(error);
  }
}

export async function updateRequest(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid request id.' });
    }

    const { userId, wasteType, address, pickupDate, pickupTime, notes, status, collectorId } = req.body || {};
    const updates = {};

    if (userId !== undefined) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid userId.' });
      }
      updates.userId = userId;
    }

    if (collectorId !== undefined) {
      if (collectorId !== null && !isValidObjectId(collectorId)) {
        return res.status(400).json({ message: 'Invalid collectorId.' });
      }
      updates.collectorId = collectorId;
    }

    if (wasteType !== undefined) updates.wasteType = String(wasteType).trim();
    if (address !== undefined) updates.address = String(address).trim();
    if (pickupDate !== undefined) updates.pickupDate = String(pickupDate).trim();
    if (pickupTime !== undefined) updates.pickupTime = String(pickupTime).trim();
    if (notes !== undefined) updates.notes = String(notes).trim();
    if (status !== undefined) updates.status = status;

    const request = await Request.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    })
      .populate('userId', 'name email role')
      .populate('collectorId', 'name email role');

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    return res.json({ message: 'Request updated successfully.', request });
  } catch (error) {
    return next(error);
  }
}

export async function deleteRequest(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid request id.' });
    }

    const request = await Request.findByIdAndDelete(id).lean();
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    return res.json({ message: 'Request deleted successfully.' });
  } catch (error) {
    return next(error);
  }
}
