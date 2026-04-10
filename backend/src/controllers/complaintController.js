import { ApiComplaint } from '../models/api/ApiComplaint.js';

function getId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function formatComplaint(complaint) {
  return {
    id: complaint.id,
    userId: complaint.userId,
    subject: complaint.subject,
    message: complaint.message,
    status: complaint.status,
    priority: complaint.priority,
    resolution: complaint.resolution,
    createdAt: complaint.createdAt
  };
}

export async function createComplaint(req, res, next) {
  try {
    const { subject, message, priority } = req.body || {};

    if (!subject || !message) {
      return res.status(400).json({ message: 'subject and message are required' });
    }

    const complaint = await ApiComplaint.create({
      id: getId('cmp'),
      userId: req.user.id,
      subject: String(subject).trim(),
      message: String(message).trim(),
      status: 'Open',
      priority: priority || 'Medium',
      resolution: '',
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({ message: 'Complaint submitted', complaint: formatComplaint(complaint) });
  } catch (error) {
    next(error);
  }
}

export async function getComplaints(req, res, next) {
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

    const [complaints, total] = await Promise.all([
      ApiComplaint.find(query).sort({ createdAt: -1 }).skip(start).limit(pageSize),
      ApiComplaint.countDocuments(query)
    ]);

    return res.json({ complaints: complaints.map((c) => formatComplaint(c)), total });
  } catch (error) {
    next(error);
  }
}

export async function updateComplaintStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body || {};

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update complaints' });
    }

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const complaint = await ApiComplaint.findOne({ id });
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.resolution = resolution || complaint.resolution || '';
    await complaint.save();

    return res.json({ message: 'Complaint updated', complaint: formatComplaint(complaint) });
  } catch (error) {
    next(error);
  }
}

export async function deleteComplaint(req, res, next) {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete complaints' });
    }

    const deleted = await ApiComplaint.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    return res.json({ message: 'Complaint deleted' });
  } catch (error) {
    next(error);
  }
}
