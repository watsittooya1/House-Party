import { baseApi } from "./baseApi";
import type {
  CreateRoomRequest,
  GetCurrentRoomResponse,
  Room,
} from "./housePartyApiTypes";

export const housePartyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    room: builder.query<Room, void>({
      query: () => "/api/room",
      providesTags: ["Room"],
    }),
    createRoom: builder.mutation<Room, CreateRoomRequest>({
      query: (request) => ({
        url: "/api/room",
        method: "POST",
        body: request,
      }),
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
    leaveRoom: builder.mutation<void, void>({
      query: () => ({
        url: "/room/leave",
        method: "POST",
      }),
      //providesTags: ["Token"],
    }),
    updateRoom: builder.mutation<void, void>({
      query: () => "/api/update-room",
    }),
    getCurrentRoom: builder.query<GetCurrentRoomResponse, void>({
      query: () => "/api/room/current",
    }),
  }),
});

export const {
  useRoomQuery,
  useCreateRoomMutation,
  useGetRoomQuery,
  useJoinRoomQuery,
  useUserInRoomQuery,
  useLeaveRoomMutation,
  useUpdateRoomMutation,
  useGetCurrentRoomQuery,
} = housePartyApi;
