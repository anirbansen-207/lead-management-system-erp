
import axiosInstance from "./axiosInstance";

// Get users with search and pagination.
export const getUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/users", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get one user's details using their MongoDB ID.
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a user's name, email or role.
export const updateUser = async ({ id, userData }) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Activate or deactivate a user account.
export const updateUserStatus = async ({ id, isActive }) => {
  try {
    const response = await axiosInstance.patch(`/users/${id}/status`, {
      isActive
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
