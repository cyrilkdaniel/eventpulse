import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { EVENTS_PATH } from "../../constants/endpoints";

const initialState = {
  events: [],
  page: {},
  pagination: {},
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.fulfilled, (state, action) => {
        state.events = action.payload.events;
        state.page = action.payload.page;
        state.pagination = action.payload.pagination;
      })
      .addCase(getEvents.rejected, (state, action) => {
        throw new Error(action.error);
      });
  },
});

export const getEvents = createAsyncThunk(
  "events/getEvents",
  async ({ keyword, startDateTime, classificationId, queryParams }) => {
    let response;
    if (queryParams) {
      response = await api.get(EVENTS_PATH, {
        params: {
          queryParams,
        },
      });
      return response.data;
    }
    // const _keyword = keyword === "" || keyword == null ? null : keyword;
    // const _startDateTime =
    //   startDateTime == null
    //     ? null
    //     : startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]");
    // const _classificationId =
    //   classificationId === "" || classificationId == null
    //     ? genreList.map((genre) => genre._id).toString()
    //     : classificationId;
    response = await api.get(EVENTS_PATH, {
      params: {
        keyword,
        startDateTime,
        classificationId,
      },
    });
    return response.data;
  }
);

export default eventSlice.reducer;
