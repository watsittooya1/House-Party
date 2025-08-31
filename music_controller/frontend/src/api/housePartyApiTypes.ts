export type Room = {
  id: string;
  code: string;
  host: string;
  guest_can_pause: boolean;
  guest_can_queue: boolean;
  votes_to_skip: number;
  created_at: Date;
};

export type RoomRequest = {
  votes_to_skip: number;
  guest_can_pause: boolean;
  guest_can_queue: boolean;
};
