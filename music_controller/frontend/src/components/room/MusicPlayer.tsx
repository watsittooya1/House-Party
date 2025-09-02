import React, { useCallback, useEffect, useMemo } from "react";
import {
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
} from "@mui/material";
import styled from "@emotion/styled";
import StyledText from "../../components/common/StyledText";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";
import colorScheme from "../../utility/colorScheme";
import {
  useGetCurrentTrackQuery,
  usePerformPauseMutation,
  usePerformPlayMutation,
  usePerformSkipMutation,
} from "../../api/spotifyApi";
import { useShallow } from "zustand/shallow";
import { useRoomStore } from "../../store/roomStore";
import useNotifications from "../../utility/notifications";
import { type FetchBaseQueryError } from "@reduxjs/toolkit/query";

const StyledSkip = styled(SkipNextIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const StyledPause = styled(PauseIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const StyledPlay = styled(PlayArrowIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const SquareImage = styled.img`
  aspect-ratio: 1;
  width: 100%;
`;

const StyledLinearProgress = styled(LinearProgress)`
  height: 10px;
  border-radius: 5px;
  ${`& .MuiLinearProgress-bar`} {
    background-color: ${colorScheme.gray};
    border-radius: 5px;
  }
  ${`&.MuiLinearProgress-colorPrimary`} {
    background-color: ${colorScheme.darkGray};
    border-radius: 5px;
  }
`;

const MusicPlayer: React.FC = () => {
  const {
    data: currentTrack,
    isLoading: isLoadingTrack,
    refetch: refreshCurrentTrack,
  } = useGetCurrentTrackQuery();
  const [performPlay, { isLoading: isLoadingPlay }] = usePerformPlayMutation();
  const [performPause, { isLoading: isLoadingPause }] =
    usePerformPauseMutation();
  const [performSkip, { isLoading: isLoadingSkip }] = usePerformSkipMutation();
  const [isHost, guestCanPause] = useRoomStore(
    useShallow((state) => [state.isHost, state.guestCanPause])
  );
  const { addNotification } = useNotifications();

  // grab song info every second!
  useEffect(() => {
    const interval = setInterval(refreshCurrentTrack, 1000);
    return () => clearInterval(interval);
  }, [refreshCurrentTrack]);

  const pauseOrPlay = useCallback(async () => {
    if (!isLoadingTrack && !isLoadingPlay && !isLoadingPause) {
      if (!currentTrack?.is_playing) {
        try {
          await performPlay().unwrap();
        } catch (err: unknown) {
          const error = err as FetchBaseQueryError;
          if (error?.status === 412) {
            addNotification({
              message: "playback failed: Spotify is not active on any device",
            });
          }
        }
      } else {
        performPause();
      }
    }
  }, [
    isLoadingTrack,
    currentTrack,
    performPlay,
    performPause,
    isLoadingPlay,
    isLoadingPause,
    addNotification,
  ]);

  const skip = useCallback(async () => {
    if (!isLoadingTrack && !isLoadingSkip) {
      try {
        await performSkip().unwrap();
      } catch (err: unknown) {
        const error = err as FetchBaseQueryError;
        if (error?.status === 403) {
          addNotification({
            message: "you've already voted to skip!",
          });
        }
      }
    }
  }, [isLoadingTrack, isLoadingSkip, performSkip, addNotification]);

  const getArtistsString = useMemo(() => {
    if (currentTrack) {
      return currentTrack.item.artists.map((a) => a.name).join(", ");
    }
    return "";
  }, [currentTrack]);

  const getVotesString = useMemo(() => {
    if (currentTrack) {
      return `${currentTrack.votes} / ${currentTrack.votes_to_skip}`;
    }
    return "";
  }, [currentTrack]);

  // cy TODO: move this progress bar optimistically!
  const songProgress = useMemo(
    () =>
      currentTrack
        ? (currentTrack.progress_ms / currentTrack.item.duration_ms) * 100
        : 0,
    [currentTrack]
  );

  return (
    <Stack margin="3%" spacing={5}>
      <Grid container spacing={3} direction="row">
        {/* album cover */}
        <Grid size={4}>
          {/* largest image is first in list */}
          <SquareImage src={currentTrack?.item.album.images[0].url} />
        </Grid>
        <Grid container size={8} gap="3%" direction="column">
          {/* song name, album name, artist name */}
          <StyledText name="title">
            {currentTrack?.item.name ?? "no track playing"}
          </StyledText>
          <StyledText name="header">{currentTrack?.item.album.name}</StyledText>
          <StyledText name="body">{getArtistsString}</StyledText>
          <Grid
            container
            justifyContent="center"
            alignContent="center"
            size="grow"
            gap={0}
          >
            {(isHost || guestCanPause) && (
              <Grid>
                <Tooltip title="Pause/Play Track">
                  <IconButton onClick={pauseOrPlay}>
                    {currentTrack?.is_playing ? (
                      <StyledPause />
                    ) : (
                      <StyledPlay />
                    )}
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            <Grid>
              <Tooltip title="Skip Track">
                <IconButton onClick={skip}>
                  <StyledSkip />
                  {currentTrack && currentTrack.votes_to_skip > 1 && (
                    <StyledText name="body">{getVotesString}</StyledText>
                  )}
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <StyledLinearProgress variant="determinate" value={songProgress} />
    </Stack>
  );
};

export default MusicPlayer;
