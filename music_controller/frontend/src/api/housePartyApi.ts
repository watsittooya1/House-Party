import { baseApi } from "./baseApi";
import type {
  RoomRequest,
  GetCurrentRoomResponse,
  Room,
} from "./housePartyApiTypes";

export const housePartyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    room: builder.query<Room, void>({
      query: () => "/api/room",
      providesTags: ["Room"],
    }),
    createRoom: builder.mutation<Room, RoomRequest>({
      query: (request) => ({
        url: "/api/room",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Room"],
    }),
    getRoom: builder.query<Room, void>({
      query: () => "/api/get-room",
      providesTags: ["Room"],
    }),
    joinRoom: builder.mutation<{ code: string }, string>({
      query: (roomCode: string) => ({
        url: `/api/join-room?code=${roomCode}`,
        method: "POST",
      }),
      invalidatesTags: ["Room"],
    }),
    userInRoom: builder.query<boolean, void>({
      query: () => "/api/user-in-room",
    }),
    leaveRoom: builder.mutation<void, void>({
      query: () => ({
        url: "/api/room/leave",
        method: "POST",
      }),
    }),
    updateRoom: builder.mutation<void, RoomRequest>({
      query: (request) => ({
        url: "/api/room",
        method: "PATCH",
        body: request,
      }),
      invalidatesTags: ["Room"],
    }),
    getCurrentRoom: builder.query<GetCurrentRoomResponse, void>({
      query: () => "/api/room/current",
      providesTags: ["Room"],
    }),
  }),
});

export const {
  useRoomQuery,
  useCreateRoomMutation,
  useGetRoomQuery,
  useJoinRoomMutation,
  useUserInRoomQuery,
  useLeaveRoomMutation,
  useUpdateRoomMutation,
  useGetCurrentRoomQuery,
} = housePartyApi;
