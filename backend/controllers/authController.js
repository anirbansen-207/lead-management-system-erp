import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  forgotPassword,
  resetPassword
} from "../services/authService.js";

// HELPER FUNCTIONS
// Cookie settings for the refresh token
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/"
};

// Register a new user
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login an existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser({
      email,
      password,
      deviceInfo: req.headers["user-agent"]
    });

    // Store the refresh token in an HTTP-only cookie
    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );

    // Send the access token and user details to the frontend
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// Generate new tokens using the refresh token cookie
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const result = await refreshUserSession(refreshToken);

    // Replace the old refresh token cookie with the new one
    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );

    return res.status(200).json({
      success: true,
      accessToken: result.accessToken
    });
  } catch (error) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/"
    });

    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// Logout the current user
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/"
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    // Clear the browser cookie even if the token is invalid
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/"
    });

    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// Send password reset OTP to the user's email
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await forgotPassword(email);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify OTP and reset the password
export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const result = await resetPassword({
      email,
      otp,
      newPassword
    });

    // Clear any existing refresh token cookie after password reset
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/"
    });

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};