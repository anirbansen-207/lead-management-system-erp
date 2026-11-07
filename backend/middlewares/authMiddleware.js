import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";

export const protect = async (req, res, next) => {
  try {
    // Get the access token from the request headers
    const authHeader = req.headers.authorization;

    // Check if the access token is present
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing.",
      });
    }

    // extract the token from the header
    const accessToken = authHeader.split(" ")[1];

    // verify the access token
    const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    // Find the user with the decoded token
    const user = await User.findById(decodedToken.sub);

    // Check if the user exists
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find the session using the session ID stored in the token
    const session = await Session.findById(decodedToken.sid);

    // Check if the session exists
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session not found.",
      });
    }

    // Check whether this session belongs to the user in the token
    if (session.user.toString() !== user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Invalid session.",
      });
    }

    // check whether the user's currently active session matches the session in the token
    if (
      !user.activeSessionId ||
      user.activeSessionId.toString() !== session._id.toString()
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token.",
      });
    }
    // Check whether the session has been revoked
    if (session.revokedAt) {
      return res.status(401).json({
        success: false,
        message: "Session has expired. Please login again.",
      });
    }

    // Check whether the session has expired
    if (session.expiresAt <= new Date()) {
      return res.status(401).json({
        success: false,
        message: "Session has expired. Please login again.",
      });
    }

    // Attach the logged-in user to the Express request obj
    req.user = user;

    // Allow the request to continue to the controller
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token.",
    });
  }
};

// Allow access only to admin users
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Access denied. Admin permission required.",
  });
};
