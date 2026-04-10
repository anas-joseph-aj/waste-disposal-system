import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../../models/User.js';

function sanitizeUser(userDoc) {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  const { password, ...safeUser } = user;
  return safeUser;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function createUser(req, res, next) {
  try {
    const { name, email, password, phone, address, role } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? String(phone).trim() : undefined,
      address: address ? String(address).trim() : undefined,
      role: role ? String(role).trim().toLowerCase() : undefined
    });

    return res.status(201).json({ message: 'User created successfully.', user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
}

export async function getUsers(req, res, next) {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role: String(role) } : {};

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (currentPage - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      User.countDocuments(query)
    ]);

    return res.json({
      users: users.map((user) => sanitizeUser(user)),
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

export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }

    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }

    const { name, email, password, phone, address, role } = req.body || {};
    const updates = {};

    if (name !== undefined) updates.name = String(name).trim();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (address !== undefined) updates.address = String(address).trim();
    if (role !== undefined) updates.role = String(role).trim().toLowerCase();

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();
      const emailOwner = await User.findOne({ email: normalizedEmail, _id: { $ne: id } }).lean();
      if (emailOwner) {
        return res.status(409).json({ message: 'Email already exists.' });
      }
      updates.email = normalizedEmail;
    }

    if (password !== undefined) {
      updates.password = await bcrypt.hash(String(password), 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ message: 'User updated successfully.', user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }

    const user = await User.findByIdAndDelete(id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return next(error);
  }
}
