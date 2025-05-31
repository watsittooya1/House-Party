import { baseApi } from "./baseApi";
//import { getQueryString } from "@utils/queryUtility";

// Define a service using a base URL and expected endpoints
export const spotifyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuthUrl: builder.query<string, void>({
      query: () => "/spotify/get-auth-url",
      //providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    getAuthToken: builder.query<string, void>({
      query: () => "/spotify/get-auth-token",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    //   transformErrorResponse: handleLogoutIfUnauthorized,
    //   transformResponse: (response: Account[], meta) => {
    //     return response
    //       .filter((a) => a.organization_roles.length > 0) // TODO https://htxlabs.atlassian.net/browse/PRD-1864 Once we limit response to accounts in the requestor's organization we won't need this filter
    //       .map((a: Account) => {
    //         if (a.organization_roles.length > 1) {
    //           throw Error(
    //             "TODO: Fix with multiorg users https://htxlabs.atlassian.net/browse/PRD-1868"
    //           );
    //         }
    //         return {
    //           ...a,
    //           role: a.organization_roles[0].role, // TODO: Will need to be smarter with multiorg users https://htxlabs.atlassian.net/browse/PRD-1868
    //         };
    //       });
    //   },

    getRedirect: builder.query<string, void>({
      query: () => "/spotify/redirect",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    getIsAuthenticated: builder.query<string, void>({
      query: () => "/spotify/is-authenticated",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    getCurrentSong: builder.query<string, void>({
      query: () => "/spotify/current-song",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    performPause: builder.query<string, void>({
      query: () => "/spotify/pause",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    performPlay: builder.query<string, void>({
      query: () => "/spotify/play",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    performSkip: builder.query<string, void>({
      query: () => "/spotify/skip",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    getQueue: builder.query<string, void>({
      query: () => "/spotify/get-queue",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    searchTrack: builder.mutation<string, void>({
      query: (request) => ({
        url: "/spotify/search-track",
        method: "POST",
        body: request,
      }),
      //invalidatesTags: ["Account"],
      //transformErrorResponse: handleLogoutIfUnauthorized,
    }),
    addToQueue: builder.query<string, void>({
      query: () => "/spotify/add-to-queue",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
    getUserName: builder.query<string, void>({
      query: () => "/spotify/get-user-name",
      providesTags: ["Token"],
      transformResponse: () => "asdf",
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAuthTokenQuery } = spotifyApi;
