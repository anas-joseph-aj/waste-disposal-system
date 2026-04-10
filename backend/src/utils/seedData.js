import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import WasteCategory from '../models/WasteCategory.js';

export async function seedDatabase() {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('✓ Database already seeded');
      return;
    }

    console.log('Seeding database...');

    // Create waste categories
    const categories = await WasteCategory.insertMany([
      { name: 'Organic', description: 'Food waste and organic materials', icon: '🌱' },
      { name: 'Plastic', description: 'Plastic bottles, bags, and containers', icon: '♻️' },
      { name: 'E-waste', description: 'Electronic waste', icon: '⚡' },
      { name: 'Hazardous', description: 'Toxic and hazardous materials', icon: '⚠️' }
    ]);

    console.log('✓ Created waste categories');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const collectorPassword = await bcrypt.hash('Collector@123', salt);
    const userPassword = await bcrypt.hash('User@123', salt);

    // Create demo users
    const users = await User.insertMany([
      {
        name: 'System Admin',
        email: 'admin@wds.local',
        phone: '000-000-0000',
        address: 'Operations Center',
        password: adminPassword,
        role: 'admin',
        employeeId: 'ADM-0001'
      },
      {
        name: 'Field Collector',
        email: 'collector@wds.local',
        phone: '000-111-2222',
        address: 'North Zone Depot',
        password: collectorPassword,
        role: 'collector',
        employeeId: 'COL-0001'
      },
      {
        name: 'Resident User',
        email: 'user@wds.local',
        phone: '000-333-4444',
        address: 'Residential Sector 1',
        password: userPassword,
        role: 'user'
      }
    ]);

    console.log('✓ Created demo users');
    console.log('\nDemo credentials:');
    console.log('  Admin: admin@wds.local / Admin@123');
    console.log('  Collector: collector@wds.local / Collector@123');
    console.log('  User: user@wds.local / User@123');

  } catch (error) {
    console.error('Seed error:', error.message);
  }
}
