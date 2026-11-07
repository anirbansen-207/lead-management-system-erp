import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";

// Get all users with search and pagination
export const getAllUsers = async ({
  page = 1,
  limit = 10,
  search = ""
}) => {
  try {
    const skip = (page - 1) * limit;

    // Search users by name or email
    const searchCondition = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    // Fetch users from MongoDB
    const users = await User.find(searchCondition)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total matching users
    const totalUsers = await User.countDocuments(searchCondition);

    return {
      users,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers
    };
  } catch (error) {
    throw error;
  }
};

// Get one user by ID
export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

// Update user details
export const updateUser = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Update only the fields allowed in this operation
    if (updateData.name !== undefined) {
      user.name = updateData.name;
    }

    if (updateData.email !== undefined) {
      user.email = updateData.email;
    }

    if (updateData.role !== undefined) {
      user.role = updateData.role;
    }

    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
  } catch (error) {
    throw error;
  }
};

// Activate or deactivate a user
export const updateUserStatus = async (userId, isActive) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.isActive = isActive;

    // If the account is deactivated, revoke its active session
    if (!isActive && user.activeSessionId) {
      await Session.findByIdAndUpdate(user.activeSessionId, {
        revokedAt: new Date()
      });

      user.activeSessionId = null;
    }

    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
  } catch (error) {
    throw error;
  }
};