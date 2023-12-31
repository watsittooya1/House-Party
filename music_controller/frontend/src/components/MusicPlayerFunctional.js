import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";

export default function MusicPlayerFunctional(props) {

  const [song, setSong] = useState({});
  const [songProgress, setSongProgress] = useState(0);
  const history = useHistory();

  useEffect(() => {
    getMusicPlayerInfo();
  }, []);

  useEffect(() => {
    const interval = setInterval(getMusicPlayerInfo, 1000);
    return () => clearInterval(interval);
  });

  function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
    return true;
  }

  async function getMusicPlayerInfo() {
    await getCurrentSong();
    setSongProgress((song.time / song.duration) * 100);
  }

  async function getCurrentSong() {
    await fetch("/spotify/current-song")
      .then((response) => {
        if (response.status == 205) {
          // room doesn't exist
          const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
          };
          fetch('/api/leave-room', requestOptions)
            .then((_response) => {
              props.leaveRoomCallback();
              history.push('/');
          });
        } else if (!response.ok || response.status === 204) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data);
      });
  }

  async function pauseSong() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/pause", requestOptions);
    getMusicPlayerInfo();
  }

  async function playSong() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/play", requestOptions);
    getMusicPlayerInfo();
  }

  async function skipSong() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/skip", requestOptions);
    getMusicPlayerInfo();
  }

  if (isEmpty(song)) {
    return (
      <Card sx={{ width: "100%" }}>
        <Grid container alignItems="center">
          <Grid
            item
            align="center"
            xs={4}
            sx={{
              height: "100%",
              "&::before": {
                display: "block",
                content: "''",
                paddingBottom: "100%",
              },
            }}
          ></Grid>
          <Grid item align="center" xs={8}>
            <Typography component="h5" variant="h5">
              Nothing playing!
            </Typography>
            <Typography color="textSecondary" variant="subtitle1" sx={{mx:2}}>
              Log in, then press play to transfer playback to this site.
            </Typography>
            <div>
              <IconButton
                onClick={() => {
                  playSong();
                }}
              >
                <PlayArrowIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={0} />
      </Card>
    );
  } else {
    return (
      <Card sx={{ width: "100%" }}>
        <script src="https://sdk.scdn.co/spotify-player.js"></script>
        <Grid container alignItems="center">
          <Grid item align="center" xs={4}>
            <img src={song.image_url} height="100%" width="100%" />
          </Grid>
          <Grid item align="center" xs={8}>
            <Typography component="h5" variant="h5">
              {song.title}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
              {song.artist}
            </Typography>
            <div>
              <IconButton
                onClick={() => {
                  song.is_playing ? pauseSong() : playSong();
                }}
              >
                {song.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton
                onClick={() => {
                  skipSong();
                }}
              >
                {song.votes} / {song.votes_required}
                <SkipNextIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={songProgress} />
      </Card>
    );
  }
}
