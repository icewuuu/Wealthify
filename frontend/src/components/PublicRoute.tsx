import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("accessToken");
      console.log("Token:", token);
      if (!token) {
        setIsAuthorized(false);
        return;
      }
      const decoded: any = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }
  console.log("isAuthorized:", isAuthorized);
  return isAuthorized ? <Navigate to="/" /> : children;
};

export default PublicRoute;
