
import axiosInstance from "./axiosInstance";

// Dashboard summary for the logged-in user.
export const getDashboardData = async () => {
  const response = await axiosInstance.get("/dashboard");
  return response.data;
};

// Paginated users for the admin dashboard.
export const getDashboardUsers = async (params = {}) => {
  const response = await axiosInstance.get("/dashboard/users", {
    params
  });

  return response.data;
};

// Paginated leads across the system for admin.
export const getDashboardLeads = async (params = {}) => {
  const response = await axiosInstance.get("/dashboard/leads", {
    params
  });

  return response.data;
};

// Get leads belonging to one selected user.
export const getSelectedUserLeads = async (userId, params = {}) => {
  const response = await axiosInstance.get(
    `/dashboard/users/${userId}/leads`,
    { params }
  );

  return response.data;
};
