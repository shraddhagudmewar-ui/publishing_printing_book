
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas connected');

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD is missing');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('User already exists:', email);
      console.log('Current role:', existingUser.role);

      if (existingUser.role !== 'admin') {
        console.log('This email belongs to a non-admin user. No changes made.');
      }

      return;
    }

    const admin = await User.create({
      name: 'KA Publications Admin',
      email,
      password,
      role: 'admin'
    });

    console.log('Admin created successfully:', admin.email);

  } catch (error) {
    console.error('Admin creation failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
