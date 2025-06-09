import { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";
import styled from "@emotion/styled";
import type { Song } from "../api/spotifyApiTypes";

const StyledGridItem = styled(Grid)<{ xsWidth?: number }>`
  size: {
    xs: ${({ xsWidth = 12 }) => xsWidth};
  }
  align-items: center;
`;

type Props = {
  leaveRoomCallback: () => void;
};
const MusicPlayerFunctional: React.FC<Props> = ({ leaveRoomCallback }) => {
  const [song, setSong] = useState<Song>();
  const [songProgress, setSongProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(getMusicPlayerInfo, 1000);
    return () => clearInterval(interval);
  });

  const getCurrentSong = useCallback(async () => {
    await fetch("/spotify/current-song")
      .then((response) => {
        if (response.status == 205) {
          // room doesn't exist
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          };
          fetch("/api/leave-room", requestOptions).then(() => {
            leaveRoomCallback();
            navigate("/");
          });
        } else if (!response.ok || response.status === 204) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data as Song);
      });
  }, [leaveRoomCallback, navigate]);

  const getMusicPlayerInfo = useCallback(async () => {
    await getCurrentSong();
    setSongProgress((song!.time / song!.duration) * 100);
  }, [getCurrentSong, setSongProgress, song]);

  useEffect(() => {
    getMusicPlayerInfo();
  }, [getMusicPlayerInfo]);

  const pauseSong = useCallback(async () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/pause", requestOptions);
    getMusicPlayerInfo();
  }, [getMusicPlayerInfo]);

  const playSong = useCallback(async () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/play", requestOptions);
    getMusicPlayerInfo();
  }, [getMusicPlayerInfo]);

  const skipSong = useCallback(async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/skip", requestOptions);
    getMusicPlayerInfo();
  }, [getMusicPlayerInfo]);

  if (song === undefined) {
    return (
      <Card sx={{ width: "100%" }}>
        <Grid container alignItems="center">
          <StyledGridItem
            xsWidth={4}
            sx={{
              height: "100%",
              "&::before": {
                display: "block",
                content: "''",
                paddingBottom: "100%",
              },
            }}
          ></StyledGridItem>
          <StyledGridItem xsWidth={8}>
            <Typography component="h5" variant="h5">
              Nothing playing!
            </Typography>
            <Typography
              color="textSecondary"
              variant="subtitle1"
              sx={{ mx: 2 }}
            >
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
          </StyledGridItem>
        </Grid>
        <LinearProgress variant="determinate" value={0} />
      </Card>
    );
  }
  return (
    <Card sx={{ width: "100%" }}>
      <script src="https://sdk.scdn.co/spotify-player.js"></script>
      <Grid container alignItems="center">
        <StyledGridItem xsWidth={4}>
          <img src={song!.image_url} height="100%" width="100%" />
        </StyledGridItem>
        <StyledGridItem xsWidth={8}>
          <Typography component="h5" variant="h5">
            {song!.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {song!.artist}
          </Typography>
          <div>
            <IconButton
              onClick={() => {
                //song!.is_playing ? pauseSong() : playSong();
                pauseSong();
              }}
            >
              {song!.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton
              onClick={() => {
                skipSong();
              }}
            >
              {song!.votes} / {song!.votes_required}
              <SkipNextIcon />
            </IconButton>
          </div>
        </StyledGridItem>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
};

export default MusicPlayerFunctional;
