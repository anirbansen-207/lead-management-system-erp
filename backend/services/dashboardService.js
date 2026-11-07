
import Lead from "../models/leadModel.js";
import User from "../models/userModel.js";

// Get dashboard summary for the logged-in user.
export const getDashboardData = async (loggedInUser) => {
  try {
    // Normal users can see only their own leads.
    if (loggedInUser.role !== "admin") {
      const [totalLeads, recentLeads] = await Promise.all([
        Lead.countDocuments({ createdBy: loggedInUser._id }),

        Lead.find({ createdBy: loggedInUser._id })
          .sort({ createdAt: -1 })
          .limit(5)
      ]);

      return {
        role: "user",
        totalLeads,
        recentLeads
      };
    }

    // Admin can see system-wide counts.
    const [totalUsers, totalLeads] = await Promise.all([
      User.countDocuments(),
      Lead.countDocuments()
    ]);

    return {
      role: "admin",
      totalUsers,
      totalLeads
    };
  } catch (error) {
    throw error;
  }
};

// Get paginated users for the admin dashboard.
export const getDashboardUsers = async ({
  page = 1,
  limit = 5,
  search = "",
  status = ""
}) => {
  try {
    const skip = (page - 1) * limit;

    const condition = {};

    // Search users by name or email.
    if (search) {
      condition.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Filter active or inactive accounts.
    if (status === "active") {
      condition.isActive = true;
    } else if (status === "inactive") {
      condition.isActive = false;
    }

    const [users, totalUsers] = await Promise.all([
      User.find(condition)
        .select("name email role isActive createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(condition)
    ]);

    // Count leads belonging to the users on the current page.
    const userIds = users.map((user) => user._id);

    const leadCounts = await Lead.aggregate([
      {
        $match: {
          createdBy: { $in: userIds }
        }
      },
      {
        $group: {
          _id: "$createdBy",
          leadCount: { $sum: 1 }
        }
      }
    ]);

    const leadCountMap = {};

    leadCounts.forEach((item) => {
      leadCountMap[item._id.toString()] = item.leadCount;
    });

    const usersWithLeadCounts = users.map((user) => ({
      ...user.toObject(),
      leadCount: leadCountMap[user._id.toString()] || 0
    }));

    return {
      users: usersWithLeadCounts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers
    };
  } catch (error) {
    throw error;
  }
};

// Get paginated leads across the system for admin.
export const getDashboardLeads = async ({
  page = 1,
  limit = 5,
  search = "",
  status = ""
}) => {
  try {
    const skip = (page - 1) * limit;

    const condition = {};

    // Search by lead name, email, phone or company.
    if (search) {
      condition.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }

    if (status) {
      condition.status = status;
    }

    const [leads, totalLeads] = await Promise.all([
      Lead.find(condition)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Lead.countDocuments(condition)
    ]);

    return {
      leads,
      currentPage: Number(page),
      totalPages: Math.ceil(totalLeads / limit),
      totalLeads
    };
  } catch (error) {
    throw error;
  }
};

// Get one particular user's leads for admin.
export const getUserDashboardLeads = async ({
  userId,
  page = 1,
  limit = 5,
  search = "",
  status = "",
  priority = "",
  source = ""
}) => {
  try {
    const skip = (page - 1) * limit;

    const condition = {
      createdBy: userId
    };

    // Search by name, email, phone or company.
    if (search) {
      condition.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }

    if (status) condition.status = status;
    if (priority) condition.priority = priority;
    if (source) condition.source = source;

    const [leads, totalLeads] = await Promise.all([
      Lead.find(condition)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Lead.countDocuments(condition)
    ]);

    return {
      leads,
      currentPage: Number(page),
      totalPages: Math.ceil(totalLeads / limit),
      totalLeads
    };
  } catch (error) {
    throw error;
  }
};
