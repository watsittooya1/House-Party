import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tagTypes = ["Song", "Token", "Room"] as const;

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${window.location.protocol}//${window.location.hostname}:8000`,
    credentials: "include",
  }),
  tagTypes,
  endpoints: () => ({}),
});
