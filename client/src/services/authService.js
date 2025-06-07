import {
  loginUser,
  registerUser,
  logoutUser,
  // refreshAccessToken,
} from "../redux/slices/authSlice";
import { clearReservations } from "../redux/slices/reservationSlice";
import { clearRecommendations } from "../redux/slices/userSlice";

// Register User
export const register = async (dispatch, userData) => {
  try {
    const response = dispatch(registerUser(userData)).unwrap(); // .unwrap() to access the resolved data
    return response; // Return the response from the action
  } catch (error) {
    console.error("Failed to register user:", error);
    throw error; // Propagate the error for further handling
  }
};

// Login User
export const login = async (dispatch, credentials) => {
  try {
    const response = await dispatch(loginUser(credentials)).unwrap();
    return response; // Return the response from the action
  } catch (error) {
    console.error("Failed to log in user:", error);
    throw error; // Propagate the error for further handling
  }
};

// Logout User
export const logout = async (dispatch, refreshToken) => {
  try {
    dispatch(clearRecommendations());
    dispatch(clearReservations());
    await dispatch(logoutUser({ refreshToken })).unwrap();
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Failed to log out user:", error);
    throw error;
  }
};
