import api from "./api";
import {
  getProfileInfo,
  getRecommendations,
  updateProfileInfo,
} from "../redux/slices/userSlice.js";
import { USER_CHANGE_PASSWORD_PATH } from "../constants/endpoints";

// Fetch profile info
export const fetchProfileInfo = async (dispatch) => {
  try {
    const response = await dispatch(getProfileInfo()).unwrap();
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Failed to fetch profile information:", error);
    throw error; // Propagate the error for further handling
  }
};

export const updateProfile = async (dispatch, profile) => {
  try {
    const response = dispatch(
      updateProfileInfo({
        profile,
      })
    );
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error; // Propagate the error for further handling
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.put(USER_CHANGE_PASSWORD_PATH, {
      ...passwordData,
    });
    return response; // Return the response from the action
  } catch (error) {
    console.error("Failed to change password:", error);
    throw error; // Propagate the error for further handling
  }
};

// Fetch recommendations
export const fetchRecommendations = async (dispatch, interests) => {
  try {
    let response;
    const classificationId = interests?.length > 0 ? interests.join(",") : "";
    response = await dispatch(
      getRecommendations({
        classificationId,
      })
    ).unwrap();

    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    throw error;
  }
};
