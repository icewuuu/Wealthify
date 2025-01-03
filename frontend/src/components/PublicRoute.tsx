import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Define a PublicRoute component to handle public route protection based on authentication state
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("accessToken");

      // If no token, the user is unauthorized
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const decoded: any = jwtDecode(token); // Decode the JWT token
        const tokenExpiration = decoded.exp; // Get the expiration time from the token
        const now = Date.now() / 1000; // Current time in seconds

        // If token is expired, user is unauthorized
        if (tokenExpiration < now) {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true); // Token is valid, user is authorized
        }
      } catch (error) {
        // In case of error decoding the token, consider the user unauthorized
        setIsAuthorized(false);
      }
    };

    checkAuth(); // Run the authentication check when the component mounts
  }, []);

  if (isAuthorized === null) {
    // Show a loading state while checking authentication
    return <div>Loading...</div>;
  }

  // Redirect authenticated users to the homepage (or any other protected route)
  if (isAuthorized) {
    return <Navigate to="/dashboard" />;
  }

  // If not authenticated, render the public content (children)
  return <>{children}</>;
};

export default PublicRoute;
