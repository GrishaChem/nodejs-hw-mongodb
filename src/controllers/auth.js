import {
  ResetPassword,
  loginOrRegister,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestResetPassword,
} from '../services/auth.js';
import { generateOAuthURL, validateCode } from '../utils/googleOAuth2.js';

export async function registerController(req, res) {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const user = await registerUser(payload);

  console.log(user);

  res.send({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  const session = await loginUser(email, password);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutController(req, res) {
  const { sessionId } = req.cookies;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.send(204).end();
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Session refreshed',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function requestResetPasswordController(req, res) {
  const { email } = req.body;

  console.log({ email });

  await requestResetPassword(email);

  res.send({ status: 200, message: 'Reset email was sent' });
}

export async function resetPasswordController(req, res) {
  const { password, token } = req.body;
  console.log('auth/controller', token);

  ResetPassword(password, token);

  res.send({ status: 200, message: 'Password reset succesfully' });
}

export async function getOAuthURLController(req, res) {
  const url = generateOAuthURL();

  res.send({
    status: 200,
    message: 'Successfully get Google OAuth URL',
    data: url,
  });
}

export async function confirmOAuthController(req, res) {
  const { code } = req.body;

  const ticket = await validateCode(code);
  const session = await loginOrRegister(ticket.payload);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Login with google successfully',
    data: {
      accessToken: session.accessToken,
    },
  });

  res.send({ status: 200 });
}
