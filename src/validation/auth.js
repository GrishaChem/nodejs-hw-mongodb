import createHttpError from 'http-errors';
import Joi from 'joi';

const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .custom((value, helpers) => {
      const domain = value.split('@')[1];
      const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
      if (!domain || !validDomains.includes(domain)) {
        return helpers.error('string.domain', { message: '' });
      }
    })
    .required(),
  password: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .custom((value, helpers) => {
      const domain = value.split('@')[1];
      const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
      if (!domain || !validDomains.includes(domain)) {
        return helpers.error('string.domain', { message: '' });
      }
    })
    .required(),
  password: Joi.string().required(),
});