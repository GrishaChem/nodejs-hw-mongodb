import express, { application } from 'express';
import pinoHttp from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { getContacts, getContactById } from './services/contacts.js'; // Функції для роботи з базою
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routers/contacts.js';
import auth from './routers/auth.js';
dotenv.config();

export const app = express();

const logger = pinoHttp();
app.use(logger);
app.use(cors());

app.use('/contacts', router);
app.use('/auth', auth);

app.use(notFoundHandler);
app.use(errorHandler);

export const setUpServer = () => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
