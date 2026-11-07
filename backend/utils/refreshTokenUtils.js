import crypto from "crypto";
import { generateRefreshToken } from "./generateToken.js";
import Session from "../models/sessionModel.js";


// Hash the refresh token before storing it in the database
export const hashRefreshToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Compare the incoming refresh token with the stored hash
export const verifyRefreshTokenHash = (token, storedHash) => {
  const incomingHash = hashRefreshToken(token);

  const incomingBuffer = Buffer.from(incomingHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (incomingBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(incomingBuffer, storedBuffer);
};

// Generate a new refresh token and update its hash in the session
export const rotateRefreshToken = async (session) => {
  const newRefreshToken = generateRefreshToken(session.user, session._id);

  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const updatedSession = await Session.findOneAndUpdate(
    {
      _id: session._id,
      refreshTokenHash: session.refreshTokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        refreshTokenHash: newRefreshTokenHash,
        lastActivityAt: new Date(),
      },
    },
    {
      new: true,
    },
  );

  // If another request already rotated the token, this update will fail
  if (!updatedSession) {
    return null;
  }

  return newRefreshToken;
};
