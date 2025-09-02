export const getArtistsString = (track: Spotify.Track) => {
  if (track) {
    return track.artists.map((a) => a.name).join(", ");
  }
  return "";
};
