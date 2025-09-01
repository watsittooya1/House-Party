import { create } from "zustand";
import { RoomResponse } from "../api/housePartyApiTypes";

type RoomState = {
  isHost: boolean;
  votesToSkip: number;
  guestCanPause: boolean;
  guestCanQueue: boolean;
  setRoomState: (roomResponse: RoomResponse) => void;
};

export const useRoomStore = create<RoomState>()((set) => ({
  isHost: false,
  votesToSkip: 2,
  guestCanPause: false,
  guestCanQueue: false,
  setRoomState: (roomResponse: RoomResponse) =>
    set((state) => ({
      ...state,
      isHost: roomResponse.is_host,
      votesToSkip: roomResponse.votes_to_skip,
      guestCanSkip: roomResponse.guest_can_pause,
      guestCanQueue: roomResponse.guest_can_queue,
    })),
}));
