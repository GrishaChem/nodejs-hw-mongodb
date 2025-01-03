import * as fs from 'node:fs';
import path from 'node:path';
import express, { application } from 'express';
import pinoHttp from 'pino-http';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import { getContacts, getContactById } from './services/contacts.js'; // Функції для роботи з базою
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { authenticate } from './middlewares/auth.js';
import cookieParser from 'cookie-parser';

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('docs/swagger.json'), 'utf-8'),
);

export const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/photos', express.static(path.resolve('src/public/photos')));

const logger = pinoHttp();
app.use(logger);
app.use(cors());
app.use(cookieParser());

app.use('/contacts', authenticate, router);
app.use('/auth', authRouter);

console.log('SERVERJS ENV', {
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
});
app.use(notFoundHandler);
app.use(errorHandler);

export const setUpServer = () => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
