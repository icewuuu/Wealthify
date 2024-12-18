import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import api from "@/api";

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        setIsAuthenticated(true);
        fetchUserData(token);
      } else {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      }
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await api.get("/api/user/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const login = (token: string) => {
    const decoded: any = jwtDecode(token);
    setIsAuthenticated(true);
    Cookies.set("accessToken", token);
    fetchUserData(token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
