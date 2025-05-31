import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tagTypes = ["Song", "Token"] as const;

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${window.location.protocol}//${window.location.hostname}/api`,
    credentials: "include",
    //prepareHeaders: it would be pertitent to provide auth headers here,
  }),
  tagTypes,
  endpoints: () => ({}),
});
