export const testAlbum1: Spotify.Album = {
  name: "album name",
  uri: "",
  images: [],
};

export const testTrack1: Spotify.Track = {
  album: testAlbum1,
  artists: [],
  duration_ms: 0,
  id: null,
  is_playable: false,
  name: "track name 1",
  uid: "",
  uri: "",
  media_type: "audio",
  type: "track",
  track_type: "audio",
  linked_from: {
    uri: null,
    id: null,
  },
};

export const testTrack2: Spotify.Track = {
  album: testAlbum1,
  artists: [],
  duration_ms: 0,
  id: null,
  is_playable: false,
  name: "track name 2",
  uid: "",
  uri: "",
  media_type: "audio",
  type: "track",
  track_type: "audio",
  linked_from: {
    uri: null,
    id: null,
  },
};

export const testTrackList: Spotify.Track[] = [testTrack1, testTrack2];
