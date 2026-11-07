
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";

import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/generateToken.js";

import generateOtp from "../utils/generateOTP.js";

import {
  hashRefreshToken,
  verifyRefreshTokenHash,
  rotateRefreshToken
} from "../utils/refreshTokenUtils.js";

import sendEmail from "../utils/sendEmail.js";

// Register a new user
export const registerUser = async ({ name, email, password }) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

  } catch (error) {
    throw error;
  }
};

// Login an existing user
export const loginUser = async ({ email, password, deviceInfo }) => {
  try {
    // As mongoose normally excludes the password field from query results by default,
    // we select it explicitly here to verify the hashed password.
    const user = await User.findOne({ email }).select("+password");

    // Check whether the account exists and whether it is active.
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Your account is inactive");
    }

    // Compare the incoming password with the stored hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    // Check whether the password is correct
    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password");
    }

    // Check whether the user already has an active session
    if (user.activeSessionId) {
      const existingSession = await Session.findById(
        user.activeSessionId
      );

      // If the user already has a valid active session, we reject another login.

      // Here three things are checked:-
      // 1. The session exists (existingSession)
      // 2. The session is not revoked (existingSession.revokedAt)
      // 3. The session is not expired (existingSession.expiresAt > new Date())

      if (
        existingSession &&
        !existingSession.revokedAt &&
        existingSession.expiresAt > new Date()
      ) {
        throw new Error("You are already logged in on another device");
      }

      // Clear the old session reference only if it is still the same session.
      // This prevents accidentally clearing a newer session created by another request.
      await User.findOneAndUpdate(
        {
          _id: user._id,
          activeSessionId: user.activeSessionId
        },
        {
          activeSessionId: null
        }
      );
    }

    // Create a new sessionID for a new session
    const sessionId = new mongoose.Types.ObjectId();

    // Generate a new refresh token using two important identifiers:
    // sub = user ID and sid = session ID
    const refreshToken = generateRefreshToken(
      user._id,
      sessionId
    );

    // Hash the refresh token and only the hash will be stored in MongoDB.
    const refreshTokenHash = hashRefreshToken(refreshToken);

    // Create a new session
    const session = await Session.create({
      _id: sessionId,
      user: user._id,
      refreshTokenHash,
      deviceInfo: deviceInfo || "Unknown device",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Assign this session as the user's active session
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        activeSessionId: null
      },
      {
        activeSessionId: session._id
      },
      {
        new: true
      }
    );

    // If the update fails, delete the session just created
    if (!updatedUser) {
      await Session.findByIdAndDelete(session._id);
      throw new Error("Another login session is already active");
    }

    // Generate an access token with the user ID and session ID
    const accessToken = generateAccessToken(
      user._id,
      session._id
    );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };

  } catch (error) {
    throw error;
  }
};

// Generate new tokens using the refresh token
export const refreshUserSession = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    // jwt.verify() checks the signature and expiry of the token.
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const userId = decodedToken.sub;
    const sessionId = decodedToken.sid;

    // Find the user
    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      throw new Error("User not found or inactive");
    }

    // Find the session
    const session = await Session.findById(sessionId)
      .select("+refreshTokenHash");

    if (!session) {
      throw new Error("Session not found");
    }

    if (
      session.user.toString() !== userId ||
      !user.activeSessionId ||
      user.activeSessionId.toString() !== sessionId ||
      session.revokedAt ||
      session.expiresAt <= new Date()
    ) {
      throw new Error("Session is no longer active");
    }

    // Compare the refresh token hash
    const isTokenValid = verifyRefreshTokenHash(
      refreshToken,
      session.refreshTokenHash
    );

    if (!isTokenValid) {
      throw new Error("Invalid refresh token");
    }

    // Replace the old refresh token with a new one
    const newRefreshToken = await rotateRefreshToken(session);

    if (!newRefreshToken) {
      throw new Error("Refresh token has already been used");
    }

    // Generate a new access token
    const accessToken = generateAccessToken(
      user._id,
      session._id
    );

    return {
      accessToken,
      refreshToken: newRefreshToken
    };

  } catch (error) {
    throw error;
  }
};

// Logout the user
export const logoutUser = async (refreshToken) => {
  try {
    if (!refreshToken) {
      return;
    }

    // jwt.verify() checks the signature and expiry of the token.
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const userId = decodedToken.sub;
    const sessionId = decodedToken.sid;

    // Find the session
    const session = await Session.findById(sessionId)
      .select("+refreshTokenHash");

    if (!session) {
      return;
    }

    // Check whether this session belongs to the user in the token
    if (session.user.toString() !== userId) {
      throw new Error("Invalid session");
    }

    // Compare the refresh token hash
    const isTokenValid = verifyRefreshTokenHash(
      refreshToken,
      session.refreshTokenHash
    );

    if (!isTokenValid) {
      return;
    }

    // Revoke the session
    await Session.findByIdAndUpdate(sessionId, {
      revokedAt: new Date()
    });

    // Remove the active session from the user
    await User.findOneAndUpdate(
      {
        _id: userId,
        activeSessionId: sessionId
      },
      {
        activeSessionId: null
      }
    );

    return {
      message: "Logged out successfully"
    };

  } catch (error) {
    throw error;
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return {
        message: "If the account exists, an OTP has been sent"
      };
    }

    // Generate a six-digit OTP
    const otp = generateOtp();

    // Hash the OTP before storing it
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Store OTP and expiry time in the user document
    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordOtpExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await user.save();

    // Send OTP through email
    const emailMessage = `
      <h2>Lead Management ERP Password Reset</h2>
      <p>Your password reset OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      <p>Do not share this OTP with anyone.</p>
    `;

    try {
      await sendEmail(
        user.email,
        "Lead Management ERP - Password Reset OTP",
        emailMessage
      );
    } catch (error) {
      // Clear the OTP if the email could not be sent
      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpires = null;

      await user.save();

      throw error;
    }

    return {
      message: "If the account exists, an OTP has been sent"
    };

  } catch (error) {
    throw error;
  }
};

// Verify OTP and reset the user's password
export const resetPassword = async ({
  email,
  otp,
  newPassword
}) => {
  try {
    // Find user and include OTP fields
    const user = await User.findOne({ email }).select(
      "+resetPasswordOtp +resetPasswordOtpExpires"
    );

    if (!user || !user.isActive) {
      throw new Error("Invalid email or OTP");
    }

    // Check whether OTP exists and has not expired
    if (
      !user.resetPasswordOtp ||
      !user.resetPasswordOtpExpires ||
      user.resetPasswordOtpExpires < new Date()
    ) {
      throw new Error("OTP is invalid or expired. Please request a new OTP");
    }

    // Hash the OTP entered by the user
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Compare entered OTP with stored OTP
    if (hashedOtp !== user.resetPasswordOtp) {
      throw new Error("Invalid OTP");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Revoke the user's existing session
    if (user.activeSessionId) {
      await Session.findByIdAndUpdate(user.activeSessionId, {
        revokedAt: new Date()
      });
    }

    // Update password and clear OTP information
    user.password = hashedPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    user.activeSessionId = null;

    await user.save();

    return {
      message: "Password reset successfully"
    };

  } catch (error) {
    throw error;
  }
};
