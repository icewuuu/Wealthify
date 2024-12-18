import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import api from "@/api";

interface AuthContextType {
  isAuthenticated: boolean;
  data: any;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        setIsAuthenticated(true);
        setData(decoded);
      } else {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      }
    }
  }, []);

  const login = (token: string) => {
    const decoded: any = jwtDecode(token);
    setIsAuthenticated(true);
    setData(decoded);
    Cookies.set("accessToken", token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setData({});
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, data, login, logout }}>
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
