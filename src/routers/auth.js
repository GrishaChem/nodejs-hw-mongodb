import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  confirmOAuthSchema,
  loginSchema,
  registerSchema,
  requestResetPasswordSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginController,
  logoutController,
  registerController,
  refreshController,
  requestResetPasswordController,
  resetPasswordController,
  getOAuthURLController,
  confirmOAuthController,
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
auth.post(
  '/send-reset-email',
  jsonParser,
  validateBody(requestResetPasswordSchema),
  ctrlWrapper(requestResetPasswordController),
);
auth.post(
  '/reset-password',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

auth.get('/get-oauth-url', ctrlWrapper(getOAuthURLController));

auth.post(
  '/confirm-oauth',
  jsonParser,
  validateBody(confirmOAuthSchema),
  ctrlWrapper(confirmOAuthController),
);

export default auth;
