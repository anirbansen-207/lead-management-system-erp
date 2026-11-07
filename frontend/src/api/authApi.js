
import axiosInstance, {
  refreshAccessToken
} from "./axiosInstance";

// Register a new user.
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login an existing user.
export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Restore the existing session or refresh the access token.
export const refreshUserSession = async () => {
  try {
    return await refreshAccessToken();
  } catch (error) {
    throw error;
  }
};

// Logout the current user.
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout", {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Send password reset OTP.
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reset password using OTP.
export const resetPassword = async (resetData) => {
  try {
    const response = await axiosInstance.post(
      "/auth/reset-password",
      resetData
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
