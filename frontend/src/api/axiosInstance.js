
import axios from "axios";

// Create the Axios instance.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Access token stays in JavaScript memory.
let accessToken = null;

// Store the refresh request while it is running.
// This prevents multiple requests from rotating the same refresh token.
let refreshPromise = null;

// Set or clear the access token.
export const setAccessToken = (token) => {
  accessToken = token;

  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

// Refresh the session.
// If a refresh request is already running, reuse that same promise.
export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post("/auth/refresh", {})
      .then((response) => {
        const newAccessToken = response.data.accessToken;

        setAccessToken(newAccessToken);

        return response.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// Add the access token to outgoing requests.
axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Handle expired access tokens.
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        // Wait for the shared refresh request.
        const response = await refreshAccessToken();

        // Retry the original request with the new access token.
        originalRequest.headers.Authorization =
          `Bearer ${response.accessToken}`;

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
