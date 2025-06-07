import axios from "axios";
import {
  AUTH_REFRESH_TOKEN_PATH,
  BASE_API_PATH,
} from "../constants/endpoints.js";
import { jwtDecode } from "jwt-decode";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_API_PATH, // Base URL for API requests
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

const refreshApi = axios.create({
  baseURL: BASE_API_PATH, // Same base URL as the main API
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Check if the token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000; // Check if the token has expired
  } catch (error) {
    return true; // If decoding fails, assume the token is expired
  }
};

// Refresh token function
const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken"); // Assuming you have stored refreshToken in localStorage
  if (refreshToken) {
    try {
      const response = await refreshApi.post(AUTH_REFRESH_TOKEN_PATH, {
        refreshToken,
      }); // Use the separate Axios instance for this request
      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken); // Save the new access token
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null; // Return null if refresh fails
    }
  }
  return null;
};

// Optional: Add an interceptor to handle authentication tokens, errors, etc.
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken"); // Get the access token from localStorage
    if (accessToken && isTokenExpired(accessToken)) {
      const newToken = await refreshToken(); // Refresh the token if expired
      if (newToken) {
        config.headers["Authorization"] = `Bearer ${newToken}`; // Add the new token to the request headers
      }
    } else if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`; // Add the token to the request headers if it is valid
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle global errors
//     console.error('API error:', error);
//     return Promise.reject(error);
//   }
// );

export default api;
