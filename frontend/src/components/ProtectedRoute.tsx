import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import api from "@/api";

// Helper functions for token management
const getAccessToken = () => Cookies.get("accessToken");
const setAccessToken = (token: string) => {
  const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  Cookies.set("accessToken", token, {
    expires: expirationTime,
    secure: true,
    sameSite: "strict",
  });
};

// Main ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Function to refresh access token using the refresh token
  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      setIsAuthorized(false);
      return;
    }

    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        setAccessToken(res.data.access); // Save new access token
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIsAuthorized(false);
    }
  };

  // Function to check if the access token is valid or expired
  const checkAuth = async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      await refreshAccessToken(); // If no access token, try refreshing
      return;
    }

    try {
      const decoded: any = jwtDecode(accessToken);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      // If token is expired, refresh it
      if (tokenExpiration < now) {
        await refreshAccessToken();
      } else {
        setIsAuthorized(true); // Token is valid, user is authorized
      }
    } catch (error) {
      // In case of error decoding the token, consider the user unauthorized
      console.error("Error decoding token:", error);
      await refreshAccessToken();
    }
  };

  // Run the auth check when component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  // Show loading state until authentication status is determined
  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  // If authorized, render the children, otherwise redirect to login
  return isAuthorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
