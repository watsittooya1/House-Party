import { baseApi } from "./baseApi";
import type { Room } from "./housePartyApiTypes";

export const housePartyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    room: builder.query<Room, void>({
      query: () => "/api/room",
      providesTags: ["Room"],
    }),
    createRoom: builder.mutation<void, void>({
      query: () => "/api/create-room",
    }),
    getRoom: builder.query<Room, void>({
      query: () => "/api/get-room",
      providesTags: ["Room"],
    }),
    joinRoom: builder.query<void, void>({
      query: () => "/api/join-room",
      providesTags: ["Room"],
    }),
    userInRoom: builder.query<boolean, void>({
      query: () => "/api/user-in-room",
    }),
    leaveRoom: builder.query<void, void>({
      query: () => "/api/leave-room",
      //providesTags: ["Token"],
    }),
    updateRoom: builder.mutation<void, void>({
      query: () => "/api/update-room",
    }),
  }),
});

export const {
  useRoomQuery,
  useCreateRoomMutation,
  useGetRoomQuery,
  useJoinRoomQuery,
  useUserInRoomQuery,
  useLeaveRoomQuery,
  useUpdateRoomMutation,
} = housePartyApi;
