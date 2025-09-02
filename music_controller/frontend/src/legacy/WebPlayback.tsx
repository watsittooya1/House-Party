/// <reference types="spotify-web-playback-sdk" />
import { useEffect } from "react";

const PLAYBACK_SRC = "https://sdk.scdn.co/spotify-player.js";

export type Props = {
  token: string;
  playbackInit: boolean;
  playbackInitCallback: () => void;
};

// cy TODO: fix some typing on this function
const WebPlayback: React.FC<Props> = ({
  token,
  playbackInit,
  playbackInitCallback,
}) => {
  //return <></>;
  useEffect(() => {
    if (playbackInit) {
      //window.Spotify.Player.connect();
    } else {
      const script = document.createElement("script");
      script.src = PLAYBACK_SRC;
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb: (token: string) => void) => {
            cb(token);
          },
          volume: 0.5,
        });

        player.addListener("ready", ({ device_id }: { device_id: string }) => {
          console.log("Web playback ready with Device ID", device_id);
        });

        player.addListener(
          "not_ready",
          ({ device_id }: { device_id: string }) => {
            console.log("Device ID has gone offline", device_id);
          }
        );

        player.addListener(
          "initialization_error",
          ({ message }: { message: string }) => {
            console.error(message);
          }
        );

        player.addListener(
          "authentication_error",
          ({ message }: { message: string }) => {
            console.error(
              `${message} This error can be ignored if web playback is ready shortly afterwards.`
            );
          }
        );

        player.addListener(
          "account_error",
          ({ message }: { message: string }) => {
            console.error(message);
          }
        );

        // document.getElementById('togglePlay').onclick = function() {
        //     player.togglePlay();
        // };

        player.connect();
      };
      playbackInitCallback();
    }
    return () => {
      //player.disconnect();
    };
  }, [playbackInit, playbackInitCallback, token]);

  return (
    <>
      <div className="container">
        <div className="main-wrapper" />
      </div>
    </>
  );
};

export default WebPlayback;
