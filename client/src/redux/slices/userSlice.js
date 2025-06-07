import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import {
  USER_PROFILE_PATH,
  USER_RECOMMENDATIONS_PATH,
} from "../../constants/endpoints";

const initialState = {
  isLoading: false, // Indicates if a request is in progress
  user: null,
  recommendations: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileInfo.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProfileInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(getProfileInfo.rejected, (state, action) => {
        state.isLoading = false;
        throw new Error(action.error);
      })
      .addCase(updateProfileInfo.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateProfileInfo.rejected, (state, action) => {
        throw new Error(action.error);
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload.recommendations;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        return action.payload;
      });
  },
});

export const getProfileInfo = createAsyncThunk(
  "user/getProfileInfo",
  async () => {
    let response;
    response = await api.get(USER_PROFILE_PATH, {});
    return response.data;
  }
);

export const updateProfileInfo = createAsyncThunk(
  "user/updateProfileInfo",
  async ({ profile }) => {
    let response;
    response = await api.put(USER_PROFILE_PATH, { ...profile });
    return response.data;
  }
);

export const getRecommendations = createAsyncThunk(
  "user/getRecommendations",
  async ({ classificationId }, { rejectWithValue }) => {
    try {
      const response = await api.get(USER_RECOMMENDATIONS_PATH, {
        params: {
          classificationId,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        return rejectWithValue({
          message: error.response.data.message,
          retryAfter: error.response.data.retryAfter,
          isRateLimited: true,
        });
      }
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to fetch recommendations",
      });
    }
  }
);

export const { clearRecommendations } = userSlice.actions;

export default userSlice.reducer;
