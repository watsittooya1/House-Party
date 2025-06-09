// todo: remove this file once all necessary files import the correct type references

export type Song = {
  title: string;
  artist: string;
  duration: number;
  time: number;
  image_url: string;
  is_playing: boolean;
  votes: number;
  votes_required: number;
  id: string;
};

export type QueueSong = {
  album: string;
  image: string;
  artists: string[];
  name: string;
  id: string;
};

export type SearchSong = Omit<QueueSong, "id"> & {
  uri: string;
};
