import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import api from "@/api";

// Interface for user data
interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
}

// Interface for the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create an AuthContext with a default undefined state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Check authentication status on initial load
  useEffect(() => {
    const authenticateUser = async () => {
      const token = Cookies.get("accessToken");

      if (token) {
        // If access token exists, validate it and fetch user data
        const decoded: any = jwtDecode(token);
        if (decoded.exp > Date.now() / 1000) {
          setIsAuthenticated(true);
          fetchUserData(token);
        } else {
          // Remove expired tokens
          clearTokens();
        }
      } else {
        // If no access token, check if refresh token exists
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          await refreshAccessToken();
        }
      }
    };

    authenticateUser();
  }, []);

  // Function to refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) return setIsAuthenticated(false);

      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        const newAccessToken = res.data.access;
        const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        Cookies.set("accessToken", newAccessToken, {
          expires: expirationTime,
          secure: true,
          sameSite: "strict",
        });
        setIsAuthenticated(true);
        fetchUserData(newAccessToken);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIsAuthenticated(false);
    }
  };

  // Fetch user data with the provided token
  const fetchUserData = async (token: string) => {
    try {
      const response = await api.get("/api/user/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // Login with token
  const login = (token: string) => {
    const decoded: any = jwtDecode(token);
    setIsAuthenticated(true);

    const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    Cookies.set("accessToken", token, {
      expires: expirationTime,
      secure: true,
      sameSite: "strict",
    });
    fetchUserData(token);
  };

  // Logout and clear tokens
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    clearTokens();
  };

  // Utility function to remove tokens
  const clearTokens = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
