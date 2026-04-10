import 'dotenv/config';
import { connectMongo } from '../src/config/mongo.js';
import { getDb } from '../src/utils/store.js';
import { ApiUser } from '../src/models/api/ApiUser.js';
import { ApiPickup } from '../src/models/api/ApiPickup.js';
import { ApiComplaint } from '../src/models/api/ApiComplaint.js';
import { ApiPayment } from '../src/models/api/ApiPayment.js';
import { ApiFeedback } from '../src/models/api/ApiFeedback.js';
import { ApiSetting } from '../src/models/api/ApiSetting.js';

async function upsertAll(items, model, mapFn) {
  for (const item of items || []) {
    const mapped = mapFn(item);
    if (!mapped?.id) {
      continue;
    }

    await model.updateOne(
      { id: mapped.id },
      { $set: mapped },
      { upsert: true }
    );
  }
}

async function run() {
  await connectMongo();

  const db = await getDb();

  await upsertAll(db.users || [], ApiUser, (u) => ({
    id: String(u.id || ''),
    name: String(u.name || ''),
    email: String(u.email || '').toLowerCase(),
    phone: String(u.phone || ''),
    address: String(u.address || ''),
    role: String(u.role || 'user'),
    profileImage: String(u.profileImage || ''),
    employeeId: String(u.employeeId || '').toUpperCase(),
    passwordHash: String(u.passwordHash || ''),
    isActive: u.isActive !== false,
    createdAt: String(u.createdAt || new Date().toISOString())
  }));

  await upsertAll(db.pickupRequests || [], ApiPickup, (p) => ({
    id: String(p.id || ''),
    userId: String(p.userId || p.user_id || ''),
    wasteType: String(p.wasteType || p.waste_type || ''),
    quantity: Number(p.quantity || 1),
    address: String(p.address || ''),
    preferredDate: String(p.preferredDate || p.preferred_date || ''),
    status: String(p.status || 'Pending'),
    collectorId: String(p.collectorId || p.collector_id || ''),
    notes: String(p.notes || ''),
    wasteImage: String(p.wasteImage || p.waste_image || ''),
    collectorProofImage: String(p.collectorProofImage || p.collector_proof_image || ''),
    paymentId: String(p.paymentId || p.payment_id || ''),
    fee: Number(p.fee || 50),
    createdAt: String(p.createdAt || p.created_at || new Date().toISOString())
  }));

  await upsertAll(db.complaints || [], ApiComplaint, (c) => ({
    id: String(c.id || ''),
    userId: String(c.userId || c.user_id || ''),
    subject: String(c.subject || ''),
    message: String(c.message || ''),
    status: String(c.status || 'Open'),
    priority: String(c.priority || 'Medium'),
    resolution: String(c.resolution || ''),
    createdAt: String(c.createdAt || c.created_at || new Date().toISOString())
  }));

  await upsertAll(db.payments || [], ApiPayment, (p) => ({
    id: String(p.id || ''),
    userId: String(p.userId || p.user_id || ''),
    pickupRequestId: String(p.pickupRequestId || p.pickup_request_id || ''),
    amount: Number(p.amount || 0),
    method: String(p.method || 'Payment'),
    status: String(p.status || 'Paid'),
    transactionId: String(p.transactionId || p.transaction_id || `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`),
    reference: String(p.reference || ''),
    createdAt: String(p.createdAt || p.created_at || new Date().toISOString())
  }));

  await upsertAll(db.feedback || [], ApiFeedback, (f) => ({
    id: String(f.id || ''),
    userId: String(f.userId || f.user_id || ''),
    pickupRequestId: String(f.pickupRequestId || f.pickup_request_id || ''),
    rating: Number(f.rating || 0),
    comment: String(f.comment || ''),
    createdAt: String(f.createdAt || f.created_at || new Date().toISOString()),
    updatedAt: String(f.updatedAt || f.updated_at || f.createdAt || f.created_at || new Date().toISOString())
  }));

  const pickupFee = Number(db.systemSettings?.pickupFee || 50);
  await ApiSetting.updateOne(
    { key: 'system' },
    { $set: { pickupFee } },
    { upsert: true }
  );

  const counts = await Promise.all([
    ApiUser.countDocuments(),
    ApiPickup.countDocuments(),
    ApiComplaint.countDocuments(),
    ApiPayment.countDocuments(),
    ApiFeedback.countDocuments()
  ]);

  console.log('Migration completed to dedicated API collections.');
  console.log(`users=${counts[0]} pickups=${counts[1]} complaints=${counts[2]} payments=${counts[3]} feedback=${counts[4]}`);
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exit(1);
  });
