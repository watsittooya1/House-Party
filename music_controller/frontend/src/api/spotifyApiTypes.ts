/// <reference types="spotify-web-playback-sdk" />

export type CurrentSongResponse = {
  is_playing: boolean;
  progress_ms: number;
  item: Spotify.Track;
  votes: number;
  votes_to_skip: number;
};

export type SearchTrackResponse = {
  tracks: Spotify.Track[];
};

// TODO: remove when legacy components removed
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
