
import Joi from "joi";

// Registration validation
export const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required(),

  password: Joi.string()
    .min(8)
    .max(128)
    .required()
});

// Login validation
export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required(),

  password: Joi.string()
    .min(1)
    .max(128)
    .required()
});

// Forgot password validation
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required()
});

// Reset password validation
export const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required(),

  otp: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required(),

  newPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
});
