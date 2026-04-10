import { ApiPickup } from '../models/api/ApiPickup.js';
import { ApiUser } from '../models/api/ApiUser.js';
import { ApiSetting } from '../models/api/ApiSetting.js';

function getId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function formatPickup(pickup) {
  return {
    id: pickup.id,
    userId: pickup.userId,
    wasteType: pickup.wasteType,
    quantity: pickup.quantity,
    address: pickup.address,
    preferredDate: pickup.preferredDate,
    status: pickup.status,
    collectorId: pickup.collectorId,
    notes: pickup.notes,
    wasteImage: pickup.wasteImage || '',
    collectorProofImage: pickup.collectorProofImage || '',
    paymentId: pickup.paymentId,
    fee: pickup.fee,
    createdAt: pickup.createdAt
  };
}

async function getPickupFee() {
  const setting = await ApiSetting.findOne({ key: 'system' }).lean();
  return Number(setting?.pickupFee || 50);
}

export async function createPickup(req, res, next) {
  try {
    const { wasteType, quantity, address, preferredDate, notes = '', wasteImage = '' } = req.body || {};

    if (!wasteType || !quantity || !address || !preferredDate) {
      return res.status(400).json({ message: 'wasteType, quantity, address, and preferredDate are required' });
    }

    const fee = await getPickupFee();
    const pickup = await ApiPickup.create({
      id: getId('pck'),
      userId: req.user.id,
      wasteType,
      quantity,
      address,
      preferredDate,
      status: 'Pending',
      collectorId: '',
      notes: String(notes || ''),
      wasteImage: String(wasteImage || ''),
      collectorProofImage: '',
      paymentId: '',
      fee,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({ message: 'Pickup request created', pickup: formatPickup(pickup) });
  } catch (error) {
    next(error);
  }
}

export async function getPickups(req, res, next) {
  try {
    const { status, skip = 0, limit = 50 } = req.query;
    const query = {};

    if (req.user.role === 'user') {
      query.userId = req.user.id;
    } else if (req.user.role === 'collector') {
      query.collectorId = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const start = Number(skip) || 0;
    const pageSize = Number(limit) || 50;

    const [pickups, total] = await Promise.all([
      ApiPickup.find(query).sort({ createdAt: -1 }).skip(start).limit(pageSize),
      ApiPickup.countDocuments(query)
    ]);

    return res.json({
      pickups: pickups.map((p) => formatPickup(p)),
      total,
      skip: start,
      limit: pageSize
    });
  } catch (error) {
    next(error);
  }
}

export async function getPickupById(req, res, next) {
  try {
    const { id } = req.params;
    const pickup = await ApiPickup.findOne({ id });
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    if (req.user.role === 'user' && pickup.userId !== req.user.id) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    if (req.user.role === 'collector' && pickup.collectorId !== req.user.id) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    return res.json({ pickup: formatPickup(pickup) });
  } catch (error) {
    next(error);
  }
}

export async function updatePickupStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, collectorProofImage = '', clearCollectorAssignment = false, rejectReason = '' } = req.body || {};

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const validStatuses = ['Pending', 'Assigned', 'In-Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const pickup = await ApiPickup.findOne({ id });
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    if (req.user.role === 'collector' && pickup.collectorId !== req.user.id) {
      return res.status(403).json({ message: 'Only assigned collector can update' });
    }

    if (req.user.role === 'user') {
      return res.status(403).json({ message: 'Users cannot update pickup status' });
    }

    pickup.status = status;

    if (clearCollectorAssignment && req.user.role === 'collector') {
      const rejectedBy = String(req.user.id || '').trim();
      pickup.collectorId = '';
      pickup.status = 'Pending';
      const reason = String(rejectReason || '').trim();
      const rejectionNote = `[Collector Rejected] ${new Date().toISOString()}${rejectedBy ? ` | by:${rejectedBy}` : ''}${reason ? ` - ${reason}` : ''}`;
      pickup.notes = [pickup.notes, rejectionNote].filter(Boolean).join('\n');
    }

    if (collectorProofImage) {
      pickup.collectorProofImage = String(collectorProofImage);
      pickup.notes = [pickup.notes, `[Proof Uploaded] ${new Date().toISOString()}`].filter(Boolean).join('\n');
    }

    await pickup.save();
    return res.json({ message: 'Pickup status updated', pickup: formatPickup(pickup) });
  } catch (error) {
    next(error);
  }
}

export async function assignCollector(req, res, next) {
  try {
    const { id } = req.params;
    const { collectorId } = req.body || {};

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can assign collectors' });
    }

    if (!collectorId) {
      return res.status(400).json({ message: 'collectorId is required' });
    }

    const [pickup, collector] = await Promise.all([
      ApiPickup.findOne({ id }),
      ApiUser.findOne({ id: collectorId, role: 'collector', isActive: true })
    ]);

    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    if (!collector) {
      return res.status(404).json({ message: 'Collector not found' });
    }

    pickup.collectorId = collectorId;
    pickup.status = 'Assigned';
    await pickup.save();

    return res.json({ message: 'Collector assigned', pickup: formatPickup(pickup) });
  } catch (error) {
    next(error);
  }
}

export async function deletePickup(req, res, next) {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete pickups' });
    }

    const deleted = await ApiPickup.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    return res.json({ message: 'Pickup request deleted' });
  } catch (error) {
    next(error);
  }
}
