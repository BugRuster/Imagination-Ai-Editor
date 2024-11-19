import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB_URL is not defined');
  }

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const options = {
      dbName: "Imagination",
      autoCreate: true,
    };

    await mongoose.connect(process.env.MONGODB_URL, options);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};