import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import api from "@/api";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        setIsAuthorized(false);
        return;
      }

      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);

      Cookies.set("accessToken", res.data.access, {
        expires: inFifteenMinutes,
        secure: true,
        sameSite: "strict",
      });
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      await refreshAccessToken();
      return;
    }

    const decoded: any = jwtDecode(accessToken);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshAccessToken();
    } else {
      setIsAuthorized(true);
    }
  };

  useEffect(() => {
    auth();
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
