
import { createContext, useEffect, useState } from "react";

import {
  loginUser,
  logoutUser,
  refreshUserSession
} from "../api/authApi";

import { setAccessToken } from "../api/axiosInstance";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the existing login session when the application starts.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
          setAccessToken(null);
          setUser(null);
          return;
        }

        const parsedUser = JSON.parse(savedUser);

        // This now shares a single refresh request across callers.
        const response = await refreshUserSession();

        setAccessToken(response.accessToken);
        setUser(parsedUser);

      } catch (error) {
        // Clear authentication state only when session restoration fails.
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem("user");

      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login function.
  const login = async (loginData) => {
    try {
      const response = await loginUser(loginData);

      setAccessToken(response.accessToken);
      setUser(response.user);

      // Store only non-secret user information.
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;

    } catch (error) {
      throw error;
    }
  };

  // Logout function.
  const logout = async () => {
    try {
      await logoutUser();

    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
