import mongoose from 'mongoose'

interface MongoOptions {
  uri: string
}

const connectDB = async ({ uri }: MongoOptions): Promise<void> => {
  if (!uri) {
    throw new Error('MONGO_URI is not defined')
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected successfully 🚀')
  } catch (err) {
    console.error('MongoDB connection error:', err)
    throw err
  }
}

export default connectDB
