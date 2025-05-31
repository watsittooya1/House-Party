//('id', 'code', 'host', 'guest_can_pause', 'guest_can_queue', 'votes_to_skip', 'created_at')

export type Room = {
  id: string;
  code: string;
  host: string;
  guest_can_pause: boolean;
  guest_can_queue: boolean;
  votes_to_skip: number;
  created_at: Date;
};
