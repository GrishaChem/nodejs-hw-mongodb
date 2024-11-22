import mongoose from 'mongoose';

export async function initMongoConnection() {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;


    await mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`);
                           
    console.log('MongoDB connection successfully established!');
  } catch (error) {
    console.error('Error while setting up MongoDB connection:', error);
    throw error;
  }
}
