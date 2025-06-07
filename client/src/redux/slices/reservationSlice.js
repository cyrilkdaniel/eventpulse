import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { BOOKING_ENDPOINT } from "../../constants/endpoints";

const initialState = {
  reservations: [],
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    clearReservations: (state) => {
      state.reservations = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReservations.fulfilled, (state, action) => {
        state.reservations = action.payload.reservations;
      })
      .addCase(getReservations.rejected, (state, action) => {
        throw new Error(action.error);
      });
  },
});

export const getReservations = createAsyncThunk(
  "reservation/getReservations",
  async () => {
    const response = await api.get(BOOKING_ENDPOINT, {});
    return response.data;
  }
);

export const { clearReservations } = reservationSlice.actions;

export default reservationSlice.reducer;
