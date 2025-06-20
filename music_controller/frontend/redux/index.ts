import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../src/api/baseApi";

export const reduxStore = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
