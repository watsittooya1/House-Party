import React, { useEffect } from "react";

const PLAYBACK_SRC = "https://sdk.scdn.co/spotify-player.js";

export default function WebPlayback(
  playbackInit: () => void,
  playbackInitCallback: () => void
) {
  useEffect(() => {
    if (playbackInit) {
      window.SpotifyPlayer.connect();
    } else {
      const script = document.createElement("script");
      script.src = PLAYBACK_SRC;
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb) => {
            cb(props.token);
          },
          volume: 0.5,
        });

        window.SpotifyPlayer = player;

        player.addListener("ready", ({ device_id }) => {
          console.log("Web playback ready with Device ID", device_id);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("initialization_error", ({ message }) => {
          console.error(message);
        });

        player.addListener("authentication_error", ({ message }) => {
          console.error(
            `${message} This error can be ignored if web playback is ready shortly afterwards.`
          );
        });

        player.addListener("account_error", ({ message }) => {
          console.error(message);
        });

        // document.getElementById('togglePlay').onclick = function() {
        //     player.togglePlay();
        // };

        player.connect();
      };
      playbackInitCallback();
    }
    return () => {
      window.SpotifyPlayer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="container">
        <div className="main-wrapper" />
      </div>
    </>
  );
}
