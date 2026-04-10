import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiUser } from '../models/api/ApiUser.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

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

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body || {};

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'name, email, phone, and password are required' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const normalizedPhone = String(phone || '').replace(/\D/g, '');
    if (!/^\d{10}$/.test(normalizedPhone)) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    }

    const loweredEmail = String(email).trim().toLowerCase();
    const existing = await ApiUser.findOne({ email: loweredEmail, isActive: true }).lean();
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const newUser = await ApiUser.create({
      id: getId('usr'),
      name: String(name).trim(),
      email: loweredEmail,
      phone: normalizedPhone,
      address: String(address || '').trim(),
      role: 'user',
      profileImage: '',
      employeeId: '',
      passwordHash: await bcrypt.hash(String(password), salt),
      isActive: true,
      createdAt: new Date().toISOString()
    });

    const token = generateToken(newUser);
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const identifier = String(email).trim();
    const loweredEmail = identifier.toLowerCase();
    const normalizedEmployeeId = identifier.toUpperCase();

    const user = await ApiUser.findOne({
      isActive: true,
      $or: [{ email: loweredEmail }, { employeeId: normalizedEmployeeId }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(String(password), String(user.passwordHash || ''));
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    return res.json({
      message: 'Login successful',
      token,
      user: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    const user = await ApiUser.findOne({ id: req.user.id, isActive: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: formatUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function checkEmail(req, res, next) {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: 'email is required' });
    }

    const exists = Boolean(await ApiUser.exists({ email, isActive: true }));
    return res.json({ exists });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const newPassword = String(req.body?.newPassword || '');

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'email and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const user = await ApiUser.findOne({ email, isActive: true });
    if (!user) {
      return res.status(404).json({ message: 'This email is not registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
}
