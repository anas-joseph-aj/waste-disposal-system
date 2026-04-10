import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Request from '../src/models/Request.js';
import Payment from '../src/models/Payment.js';
import { ApiUser } from '../src/models/api/ApiUser.js';

async function seedDemoApiUsers() {
  const demoUsers = [
    {
      id: 'usr-demo-admin',
      name: 'Demo Admin',
      email: 'admin@.com',
      phone: '9000000001',
      address: 'Head Office',
      role: 'admin',
      employeeId: 'ADM-0001',
      profileImage: '',
      password: 'Admin@123',
      isActive: true
    },
    {
      id: 'usr-demo-collector',
      name: 'Demo Collector',
      email: 'demo.collector@wds.local',
      phone: '9000000002',
      address: 'Collector Zone 1',
      role: 'collector',
      employeeId: 'COL-0001',
      profileImage: '',
      password: 'Collector@123',
      isActive: true
    },
    {
      id: 'usr-demo-user',
      name: 'Demo User',
      email: 'demo.user@wds.local',
      phone: '9000000003',
      address: 'User Area 1',
      role: 'user',
      employeeId: '',
      profileImage: '',
      password: 'User@123',
      isActive: true
    }
  ];

  for (const entry of demoUsers) {
    const passwordHash = await bcrypt.hash(entry.password, 10);

    await ApiUser.findOneAndUpdate(
      { id: entry.id },
      {
        $set: {
          id: entry.id,
          name: entry.name,
          email: entry.email,
          phone: entry.phone,
          address: entry.address,
          role: entry.role,
          employeeId: entry.employeeId,
          profileImage: entry.profileImage,
          passwordHash,
          isActive: entry.isActive
        },
        $setOnInsert: {
          createdAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );
  }
}

async function seedUsers() {
  const seedUsersData = [
    {
      name: 'Anita Sharma',
      email: 'anita.user@example.com',
      password: 'User@123',
      phone: '9876543210',
      address: '12 Green Street, Bengaluru',
      role: 'user'
    },
    {
      name: 'Ravi Kumar',
      email: 'ravi.user@example.com',
      password: 'User@123',
      phone: '9876500011',
      address: '44 Lake Road, Bengaluru',
      role: 'user'
    },
    {
      name: 'Meera Collector',
      email: 'meera.collector@example.com',
      password: 'Collector@123',
      phone: '9876500099',
      address: '8 Service Lane, Bengaluru',
      role: 'collector'
    },
    {
      name: 'Admin One',
      email: 'admin@example.com',
      password: 'Admin@123',
      phone: '9876500077',
      address: '1 Admin Block, Bengaluru',
      role: 'admin'
    }
  ];

  const usersByEmail = {};

  for (const entry of seedUsersData) {
    const user = await User.findOneAndUpdate(
      { email: entry.email },
      { $setOnInsert: entry },
      { returnDocument: 'after', upsert: true }
    );

    usersByEmail[entry.email] = user;
  }

  return usersByEmail;
}

async function seedRequests(usersByEmail) {
  const requestsSeedData = [
    {
      userId: usersByEmail['anita.user@example.com']._id,
      wasteType: 'Plastic',
      address: '12 Green Street, Bengaluru',
      pickupDate: '2026-04-06',
      pickupTime: '10:00 AM',
      notes: 'Two large bags',
      status: 'Assigned',
      collectorId: usersByEmail['meera.collector@example.com']._id
    },
    {
      userId: usersByEmail['ravi.user@example.com']._id,
      wasteType: 'Organic',
      address: '44 Lake Road, Bengaluru',
      pickupDate: '2026-04-07',
      pickupTime: '09:30 AM',
      notes: 'Kitchen waste only',
      status: 'Pending',
      collectorId: null
    },
    {
      userId: usersByEmail['anita.user@example.com']._id,
      wasteType: 'E-Waste',
      address: '12 Green Street, Bengaluru',
      pickupDate: '2026-04-08',
      pickupTime: '04:00 PM',
      notes: 'Old charger and cables',
      status: 'Completed',
      collectorId: usersByEmail['meera.collector@example.com']._id
    }
  ];

  const requests = [];

  for (const entry of requestsSeedData) {
    const request = await Request.findOneAndUpdate(
      {
        userId: entry.userId,
        wasteType: entry.wasteType,
        pickupDate: entry.pickupDate,
        pickupTime: entry.pickupTime
      },
      { $setOnInsert: entry },
      { returnDocument: 'after', upsert: true }
    );

    requests.push(request);
  }

  return requests;
}

async function seedPayments(usersByEmail, requests) {
  const completedRequest = requests.find((r) => r.status === 'Completed');
  const assignedRequest = requests.find((r) => r.status === 'Assigned');

  const paymentsSeedData = [
    {
      userId: usersByEmail['anita.user@example.com']._id,
      requestId: completedRequest._id,
      amount: 120,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      transactionId: 'TXN-WDS-1001',
      paidAt: new Date('2026-04-08T16:30:00.000Z')
    },
    {
      userId: usersByEmail['anita.user@example.com']._id,
      requestId: assignedRequest._id,
      amount: 80,
      paymentMethod: 'Cash',
      paymentStatus: 'Pending',
      transactionId: 'TXN-WDS-1002'
    }
  ];

  for (const entry of paymentsSeedData) {
    await Payment.findOneAndUpdate(
      { transactionId: entry.transactionId },
      { $setOnInsert: entry },
      { returnDocument: 'after', upsert: true }
    );
  }
}

async function runSeed() {
  try {
    await connectDB();
    await seedDemoApiUsers();

    const usersByEmail = await seedUsers();
    const requests = await seedRequests(usersByEmail);
    await seedPayments(usersByEmail, requests);

    const [userCount, requestCount, paymentCount, apiUserCount] = await Promise.all([
      User.countDocuments(),
      Request.countDocuments(),
      Payment.countDocuments(),
      ApiUser.countDocuments()
    ]);

    console.log('Seed completed successfully.');
    console.log(`Users: ${userCount}`);
    console.log(`Requests: ${requestCount}`);
    console.log(`Payments: ${paymentCount}`);
    console.log(`ApiUsers (login accounts): ${apiUserCount}`);
    console.log('Demo login credentials:');
    console.log('1) Admin -> admin@.com / Admin@123');
    console.log('2) Collector -> demo.collector@wds.local / Collector@123');
    console.log('3) User -> demo.user@wds.local / User@123');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

runSeed();
