const mongoose = require('mongoose');

MONGODB_DB_NAME = process.env.DB_NAME || 'default_db';
MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI,{dbName: MONGODB_DB_NAME});
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  } 
};

module.exports = connectDB;