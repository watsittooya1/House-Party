import React from 'react';
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/playArrow';
import SkipNextIcon from '@mui/icons-material/skipNext';
import PauseIcon from '@mui/icons-material/pause';

export default function MusicPlayerFunctional(props) {
  
  if (props.nonePlaying) {
    return (
      <Card sx={{ width: '100%' }} >
        <Grid container alignItems="center">
          <Grid item align="center" xs={4} sx={{ 
            height:'100%',
            "&::before": {
              display: "block",
              content: "''",
              paddingBottom: "100%"}
            }}>
          </Grid>
          <Grid item align="center" xs={8}>
            <Typography component="h5" variant="h5">
              Nothing playing!
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
              Queue up a song to bring up the music controller.
            </Typography>
            <div>
              <IconButton>
                <PauseIcon />
              </IconButton>
              <IconButton>
                <SkipNextIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={0}/>
      </Card>
    )
  }

    const songProgress = (props.time / props.duration) * 100;

    function pauseSong() {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        };
        fetch("/spotify/pause", requestOptions);
    }

    function playSong() {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        };
        fetch("/spotify/play", requestOptions);
    }

    function skipSong() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        };
        fetch("/spotify/skip", requestOptions);
    }

    return (
            <Card sx={{ width: '100%' }}>
              <script src="https://sdk.scdn.co/spotify-player.js"></script>
              <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                  <img src={props.image_url} height="100%" width="100%" />
                </Grid>
                <Grid item align="center" xs={8}>
                  <Typography component="h5" variant="h5">
                    {props.title}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle1">
                    {props.artist}
                  </Typography>
                  <div>
                    <IconButton onClick={() => {
                        props.is_playing ? pauseSong() : playSong();
                        }}>
                      {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton onClick={() => {
                        skipSong();
                    }}>
                      {props.votes} / {" "} {props.votes_required}
                      <SkipNextIcon />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
              <LinearProgress variant="determinate" value={songProgress} />
            </Card>
        );
    }