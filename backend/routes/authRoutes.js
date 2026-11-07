
import express from "express";

import {
  register,
  login,
  refresh,
  logout,
  forgotPasswordController,
  resetPasswordController
} from "../controllers/authController.js";

import validateRequest from "../middlewares/validateMiddleware.js";

import {
  authLimiter,
  registerLimiter,
  loginLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  refreshLimiter
} from "../middlewares/rateLimitMiddleware.js";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validations/authValidation.js";

const router = express.Router();

// Apply general rate limiting to authentication routes
router.use(authLimiter);

// Register
router.post(
  "/register",
  registerLimiter,
  validateRequest(registerSchema),
  register
);

// Login
router.post(
  "/login",
  loginLimiter,
  validateRequest(loginSchema),
  login
);

// Refresh access token
router.post(
  "/refresh",
  refreshLimiter,
  refresh
);

// Logout
router.post("/logout", logout);

// Forgot password
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateRequest(forgotPasswordSchema),
  forgotPasswordController
);

// Reset password
router.post(
  "/reset-password",
  resetPasswordLimiter,
  validateRequest(resetPasswordSchema),
  resetPasswordController
);

export default router;
