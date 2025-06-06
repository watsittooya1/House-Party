/// <reference types="spotify-web-playback-sdk" />
import { baseApi } from "./baseApi";

// Define a service using a base URL and expected endpoints
export const spotifyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuthUrl: builder.query<{ url: string }, void>({
      query: () => "/spotify/get-auth-url",
      //providesTags: ["Token"],
    }),
    getAuthToken: builder.query<{ token: string }, void>({
      query: () => "/spotify/get-auth-token",
      //providesTags: ["Token"],
    }),

    // cy TODO
    getRedirect: builder.query<string, void>({
      query: () => "/spotify/redirect",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    getIsAuthenticated: builder.query<{ status: boolean }, void>({
      query: () => "/spotify/is-authenticated",
      //providesTags: ["Token"],
    }),
    getCurrentSong: builder.query<Spotify.Track, void>({
      query: () => "/spotify/current-song",
      providesTags: ["Song"],
    }),
    performPause: builder.query<void, void>({
      query: () => "/spotify/pause",
    }),
    performPlay: builder.query<void, void>({
      query: () => "/spotify/play",
    }),
    performSkip: builder.query<void, void>({
      query: () => "/spotify/skip",
    }),
    getQueue: builder.query<Spotify.Track[], void>({
      query: () => "/spotify/get-queue",
    }),
    searchTrack: builder.query<Spotify.Track[], void>({
      query: () => "/spotify/search-track",
    }),
    addToQueue: builder.query<void, void>({
      query: () => "/spotify/add-to-queue",
    }),
    getUserName: builder.query<{ username: string }, void>({
      query: () => "/spotify/get-user-name",
    }),
  }),
});

export const {
  useGetAuthUrlQuery,
  useGetAuthTokenQuery,
  useGetRedirectQuery,
  useGetIsAuthenticatedQuery,
  useGetCurrentSongQuery,
  useLazyGetCurrentSongQuery,
  usePerformPauseQuery,
  usePerformPlayQuery,
  usePerformSkipQuery,
  useGetQueueQuery,
  useSearchTrackQuery,
  useAddToQueueQuery,
  useGetUserNameQuery,
} = spotifyApi;
