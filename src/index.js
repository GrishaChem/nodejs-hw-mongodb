console.log('Loaded environment variables:', {
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  PORT: process.env.PORT,
});

import { initMongoConnection } from './db/initMongoConnection.js';
import { setUpServer } from './server.js';
const bootStrap = async () => {
  try {
    await initMongoConnection();

    setUpServer();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

bootStrap();
