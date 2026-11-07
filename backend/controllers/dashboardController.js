
import {
  getDashboardData,
  getDashboardUsers,
  getDashboardLeads,
  getUserDashboardLeads
} from "../services/dashboardService.js";

import User from "../models/userModel.js";

// Dashboard summary.
export const getDashboard = async (req, res) => {
  try {
    const result = await getDashboardData(req.user);

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

// Admin: paginated users and their lead counts.
export const getDashboardUsersList = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 5));

    const result = await getDashboardUsers({
      page,
      limit,
      search: String(req.query.search || "").trim(),
      status: String(req.query.status || "")
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

// Admin: paginated system-wide leads.
export const getDashboardLeadsList = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 5));

    const result = await getDashboardLeads({
      page,
      limit,
      search: String(req.query.search || "").trim(),
      status: String(req.query.status || "")
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

// Admin: leads belonging to one selected user.
export const getSelectedUserLeads = async (req, res) => {
  try {
    const { userId } = req.params;

    const selectedUser = await User.findById(userId)
      .select("name email role isActive");

    if (!selectedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 5));

    const result = await getUserDashboardLeads({
      userId,
      page,
      limit,
      search: String(req.query.search || "").trim(),
      status: String(req.query.status || ""),
      priority: String(req.query.priority || ""),
      source: String(req.query.source || "")
    });

    return res.status(200).json({
      success: true,
      user: selectedUser,
      ...result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
