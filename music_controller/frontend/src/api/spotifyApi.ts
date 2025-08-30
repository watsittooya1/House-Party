import { baseApi } from "./baseApi";
import {
  type CurrentSongResponse,
  type SearchTrackResponse,
} from "./spotifyApiTypes";

export const spotifyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuthUrl: builder.query<{ url: string }, void>({
      query: () => "/spotify/auth-url",
    }),
    getHostToken: builder.query<{ token: string }, void>({
      query: () => "/spotify/host-token",
      providesTags: ["Token"],
    }),
    getCurrentTrack: builder.query<CurrentSongResponse | null, void>({
      query: () => "/spotify/current-track",
      providesTags: ["Track"],
    }),
    performPause: builder.mutation<void, void>({
      query: () => ({ url: "/spotify/pause", method: "PUT" }),
      invalidatesTags: ["Track"],
    }),
    performPlay: builder.mutation<void, void>({
      query: () => ({ url: "/spotify/play", method: "PUT" }),
      invalidatesTags: ["Track"],
    }),
    performSkip: builder.mutation<void, void>({
      query: () => ({ url: "/spotify/skip", method: "POST" }),
      invalidatesTags: ["Track", "Queue"],
    }),
    getQueue: builder.query<{ queue: Spotify.Track[] }, void>({
      query: () => "/spotify/queue",
      providesTags: ["Queue"],
    }),
    searchTrack: builder.query<SearchTrackResponse, { query: string }>({
      query: (request) => `/spotify/search?q=${request.query}`,
    }),
    addToQueue: builder.mutation<void, { uri: string }>({
      query: (request) => ({
        url: `/spotify/queue?uri=${request.uri}`,
        method: "POST",
      }),
      invalidatesTags: ["Queue"],
    }),
    getUserName: builder.query<{ username: string }, void>({
      query: () => "/spotify/username",
      providesTags: ["Login"],
    }),
  }),
});

export const {
  useLazyGetAuthUrlQuery,
  useGetHostTokenQuery,
  useGetCurrentTrackQuery,
  usePerformPauseMutation,
  usePerformPlayMutation,
  usePerformSkipMutation,
  useGetQueueQuery,
  useLazySearchTrackQuery,
  useAddToQueueMutation,
  useGetUserNameQuery,
} = spotifyApi;
