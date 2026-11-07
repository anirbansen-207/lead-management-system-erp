
import jwt from "jsonwebtoken";

// Generate a short-lived access token
export const generateAccessToken = (userId, sessionId) => {
  return jwt.sign(
    {
      sub: userId.toString(),
      sid: sessionId.toString()
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"
    }
  );
};

// Generate a longer-lived refresh token
export const generateRefreshToken = (userId, sessionId) => {
  return jwt.sign(
    {
      sub: userId.toString(),
      sid: sessionId.toString()
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "1d"
    }
  );
};
