import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import {
  AUTH_LOGIN_PATH,
  AUTH_LOGOUT_PATH,
  AUTH_REGISTER_PATH,
} from "../../constants/endpoints";

const initialState = {
  isLoggedIn: false,
  isLoading: false, // Indicates if a request is in progress
  error: null, // Holds any errors from login or registration
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  // reducers: {
  //   logoutUser: (state) => {
  //     state.isLoggedIn = false;
  //     state.error = null;
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("refreshToken");
  //   },
  // },
  extraReducers: (builder) => {
    builder
      // Handle Registration
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        localStorage.setItem("accessToken", action.payload.accessToken); // Store token locally
        localStorage.setItem("refreshToken", action.payload.refreshToken); // Store token locally
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.error = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(AUTH_REGISTER_PATH, {
        username,
        email,
        password,
      });
      return response.data; // Expecting success message in response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(AUTH_LOGIN_PATH, { email, password });
      return response.data; // Expecting token and user info in response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async ({ refreshToken }, { rejectWithValue }) => {
    try {
      const response = await api.post(AUTH_LOGOUT_PATH, { refreshToken });
      return response.data; // Expecting token and user info in response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;
