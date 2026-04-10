import bcrypt from 'bcryptjs';
import { ApiUser } from '../models/api/ApiUser.js';

function getId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage || '',
    employeeId: user.employeeId || ''
  };
}

function normalizeEmployeeId(value) {
  return String(value || '').trim().toUpperCase();
}

function nextCollectorEmployeeId(users = []) {
  const maxNum = users
    .filter((u) => u.role === 'collector')
    .map((u) => normalizeEmployeeId(u.employeeId || ''))
    .map((id) => {
      const match = /^COL-(\d+)$/.exec(id);
      return match ? Number(match[1]) : 0;
    })
    .reduce((max, current) => Math.max(max, current), 0);

  return `COL-${String(maxNum + 1).padStart(4, '0')}`;
}

export async function getAllUsers(req, res, next) {
  try {
    const { role } = req.query;
    const query = { isActive: true };
    if (role) {
      query.role = role;
    }

    const users = await ApiUser.find(query).sort({ createdAt: -1 });
    return res.json({ users: users.map((u) => formatUser(u)) });
  } catch (error) {
    next(error);
  }
}

export async function getCollectors(req, res, next) {
  try {
    const collectors = await ApiUser.find({ role: 'collector', isActive: true }).sort({ createdAt: -1 });
    return res.json({ collectors: collectors.map((c) => formatUser(c)) });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const user = await ApiUser.findOne({ id, isActive: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: formatUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { id } = req.params;
    const { name, phone, address, profileImage, email } = req.body || {};

    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const user = await ApiUser.findOne({ id, isActive: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email) {
      const loweredEmail = String(email).trim().toLowerCase();
      const conflict = await ApiUser.findOne({ id: { $ne: id }, email: loweredEmail, isActive: true }).lean();
      if (conflict) {
        return res.status(409).json({ message: 'An account with this email already exists' });
      }
      user.email = loweredEmail;
    }

    if (name !== undefined) user.name = String(name).trim();
    if (phone !== undefined) user.phone = String(phone).trim();
    if (address !== undefined) user.address = String(address).trim();
    if (profileImage !== undefined) user.profileImage = String(profileImage || '');

    await user.save();
    return res.json({ message: 'Profile updated successfully', user: formatUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const user = await ApiUser.findOne({ id, isActive: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = await bcrypt.compare(String(currentPassword), String(user.passwordHash || ''));
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(String(newPassword), salt);
    await user.save();

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete users' });
    }

    const user = await ApiUser.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const { name, email, phone, role, password, address, employeeId } = req.body || {};

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create users' });
    }

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'name, email, phone, and password are required' });
    }

    const loweredEmail = String(email).trim().toLowerCase();
    const normalizedRole = String(role || 'user').trim().toLowerCase();

    if (!['user', 'collector', 'admin'].includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role value' });
    }

    const existing = await ApiUser.findOne({ email: loweredEmail, isActive: true }).lean();
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    let resolvedEmployeeId = normalizeEmployeeId(employeeId);
    if (normalizedRole === 'collector' && !resolvedEmployeeId) {
      const collectors = await ApiUser.find({ role: 'collector', isActive: true }).lean();
      resolvedEmployeeId = nextCollectorEmployeeId(collectors);
    }

    if (resolvedEmployeeId) {
      const employeeConflict = await ApiUser.findOne({ employeeId: resolvedEmployeeId, isActive: true }).lean();
      if (employeeConflict) {
        return res.status(409).json({ message: 'Employee code already exists' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const newUser = await ApiUser.create({
      id: getId('usr'),
      name: String(name).trim(),
      email: loweredEmail,
      phone: String(phone).trim(),
      address: String(address || '').trim(),
      role: normalizedRole,
      employeeId: resolvedEmployeeId,
      passwordHash: await bcrypt.hash(String(password), salt),
      profileImage: '',
      isActive: true,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}
