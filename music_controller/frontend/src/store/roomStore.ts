import { create } from "zustand";
import { type RoomResponse } from "../api/housePartyApiTypes";

type RoomState = {
  showSettings: boolean;
  showQueueMenu: boolean;
  isHost: boolean;
  votesToSkip: number;
  guestCanPause: boolean;
  guestCanQueue: boolean;
  setRoomSettings: (roomResponse: RoomResponse) => void;
  setShowSettings: (show: boolean) => void;
  setShowQueueMenu: (show: boolean) => void;
};

export const useRoomStore = create<RoomState>()((set) => ({
  showSettings: false,
  showQueueMenu: false,
  isHost: false,
  votesToSkip: 2,
  guestCanPause: false,
  guestCanQueue: false,
  setRoomSettings: (roomResponse: RoomResponse) =>
    set((state) => ({
      ...state,
      isHost: roomResponse.is_host,
      votesToSkip: roomResponse.votes_to_skip,
      guestCanPause: roomResponse.guest_can_pause,
      guestCanQueue: roomResponse.guest_can_queue,
    })),
  setShowSettings: (show: boolean) =>
    set((state) => ({
      ...state,
      showSettings: show,
    })),
  setShowQueueMenu: (show: boolean) =>
    set((state) => ({
      ...state,
      showQueueMenu: show,
    })),
}));
