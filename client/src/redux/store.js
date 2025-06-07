import { configureStore } from "@reduxjs/toolkit";
import genreReducer from "./slices/genreSlice";
import eventReducer from "./slices/eventSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import reservationReducer from "./slices/reservationSlice";

export const store = configureStore({
  reducer: {
    genreReducer,
    eventReducer,
    authReducer,
    userReducer,
    reservationReducer,
  },
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
