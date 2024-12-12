import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema, registerSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginController,
  logoutController,
  registerController,
  refreshController,
} from '../controllers/auth.js';

const auth = express.Router();
const jsonParser = express.json();

auth.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

auth.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);
auth.post('/logout', ctrlWrapper(logoutController));
auth.post('/refresh', ctrlWrapper(refreshController));

export default auth;
