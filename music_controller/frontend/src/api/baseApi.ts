import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const getCsrfHeader = (headers: Headers) => {
  const token = Cookies.get("csrftoken");
  if (token && !headers.get("X-CSRFToken")) {
    headers.set("X-CSRFToken", token);
  }
};

export const tagTypes = ["Track", "Token", "Room", "Login", "Queue"] as const;

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${window.location.protocol}//${window.location.hostname}:8000`,
    credentials: "include",
    prepareHeaders: getCsrfHeader,
  }),
  tagTypes,
  endpoints: () => ({}),
});
