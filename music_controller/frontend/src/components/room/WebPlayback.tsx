/// <reference types="spotify-web-playback-sdk" />
import { useEffect } from "react";

const SCRIPT_ID = "web-playback-sdk";
const PLAYBACK_SRC = "https://sdk.scdn.co/spotify-player.js";

export type Props = {
  token: string;
};

const WebPlayback: React.FC<Props> = ({ token }) => {
  useEffect(() => {
    // embed the SDK if not exists yet
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = PLAYBACK_SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    let player: Spotify.Player;

    // const player = new window.Spotify.Player({
    //   name: "Web Playback SDK",
    //   getOAuthToken: (cb: (token: string) => void) => {
    //     cb(token);
    //   },
    //   volume: 0.5,
    // });

    // initialize the player
    window.onSpotifyWebPlaybackSDKReady = () => {
      player = new window.Spotify.Player({
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

      player.connect();
    };
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  return <div className="web-playback" />;
};

export default WebPlayback;
