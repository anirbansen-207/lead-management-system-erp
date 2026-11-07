import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus
} from "../services/userService.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const result = await getAllUsers({
      page: Number(page),
      limit: Number(limit),
      search
    });

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get one user
export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update user details
export const editUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Activate or deactivate a user
export const changeUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await updateUserStatus(
      req.params.id,
      isActive
    );

    return res.status(200).json({
      success: true,
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};