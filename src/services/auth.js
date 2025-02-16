import * as fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import crypto from 'node:crypto';
import { requestResetPasswordController } from '../controllers/auth.js';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/sendMail.js';
import handlebars from 'handlebars';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/reset-password.hbs'),
  { encoding: 'utf-8' },
);

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError(409, 'Email already in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createHttpError(401, 'Email or password is invalid');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch === false) {
    throw createHttpError(401, 'Email or password is invalid');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 180 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token is not valid');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 180 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function requestResetPassword(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  );
  console.log(resetToken);

  console.log('11111111111');

  // console.log('RESET TOKEN: ', resetToken);

  const html = handlebars.compile(RESET_PASSWORD_TEMPLATE);

  console.log(resetToken);

  await sendMail({
    from: 'nodejsmentor@gmail.com',
    to: user.email,
    subject: 'Reset password',
    html: html({
      resetToken,
    }),
  });
}

export async function ResetPassword(newPassword, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.sub, email: decoded.email });

    if (user === null) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    console.log(decoded);
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Token error');
    }
    console.log(error);
    throw error;
  }
}

export async function loginOrRegister(payload) {
  const user = await User.findOne({ email: payload.email });

  const password = await bcrypt.hash(
    crypto.randomBytes(30).toString('base64'),
    10,
  );

  if (user === null) {
    const createdUser = await User.create({
      email: payload.email,
      name: payload.name,
      password,
    });
    return Session.create({
      userId: createdUser._id,
      accessToken: crypto.randomBytes(30).toString('base64'),
      refreshToken: crypto.randomBytes(30).toString('base64'),
      accessTokenValidUntil: new Date(Date.now() + 180 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 180 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}
