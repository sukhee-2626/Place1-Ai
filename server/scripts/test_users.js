const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/place1ai';

async function check() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB Connected.');

  const users = await User.find({}).select('+password');
  console.log('Total users:', users.length);
  for (const u of users) {
    console.log(`- ${u.name} (${u.email}) [role: ${u.role}]`);
    const matches = await u.comparePassword(u.role === 'admin' ? 'admin123' : 'password123');
    console.log(`  Password comparison:`, matches ? '✅ MATCH' : '❌ NO MATCH');
  }

  mongoose.connection.close();
}

check();
