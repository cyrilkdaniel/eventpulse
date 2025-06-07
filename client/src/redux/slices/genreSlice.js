import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { GENRES_PATH } from "../../constants/endpoints";

const initialState = {
  genres: [],
};

const genreSlice = createSlice({
  name: "genres",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
      .addCase(getGenres.rejected, (state, action) => {
        throw new Error(action.error);
      });
  },
});

export const getGenres = createAsyncThunk("genres/getGenres", async () => {
  const response = await api.get(GENRES_PATH);
  return response.data;
});

export default genreSlice.reducer;
