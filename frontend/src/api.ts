import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Function to get the access token from cookies
const getAccessToken = () => Cookies.get("accessToken");

// Function to set the access token in cookies
const setAccessToken = (token: string) => {
  const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  Cookies.set("accessToken", token, {
    expires: expirationTime,
    secure: true,
    sameSite: "strict",
  });
};

// Request interceptor to add Authorization header if access token exists
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors and token refresh
api.interceptors.response.use(
  (response) => response, // No modification needed for successful responses
  async (error) => {
    const originalRequest = error.config;
    // Only attempt token refresh once for the same request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Get refresh token and attempt to refresh access token
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        );
        setAccessToken(data.access); // Store new access token in cookies
        originalRequest.headers.Authorization = `Bearer ${data.access}`; // Retry original request with new token
        return api(originalRequest); // Retry the failed request with updated token
      } catch (refreshError) {
        return Promise.reject(refreshError); // Reject with error if refresh fails
      }
    }
    return Promise.reject(error); // Reject with original error if it's not a 401 or refresh fails
  }
);

export default api;
