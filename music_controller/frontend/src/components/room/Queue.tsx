/// <reference types="spotify-web-playback-sdk" />
import React, { useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import StyledText from "../../components/common/StyledText";
import { useGetQueueQuery } from "../../api/spotifyApi";
import { Grid, IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import colorScheme from "../../utility/colorScheme";
import { useShallow } from "zustand/shallow";
import { useRoomStore } from "../../store/roomStore";

const getArtistsString = (artists: Spotify.Entity[]) => {
  return artists.map((a) => a.name).join(", ");
};

const TrackFade = styled(Grid)`
  mask-image: linear-gradient(180deg, #000 80%, transparent 100%);
`;

const LeftBorderGrid = styled(Grid)`
  border-left: 1px ${colorScheme.gray} solid;
  padding-left: 7%;
  padding-right: 7%;
`;

const SquareImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
`;

const StyledAdd = styled(AddCircleOutlineIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const Queue: React.FC = () => {
  const {
    data,
    isLoading: isLoadingQueue,
    refetch: refreshQueue,
  } = useGetQueueQuery();
  const [isHost] = useRoomStore(useShallow((state) => [state.isHost]));
  const [setShowQueueMenu] = useRoomStore(
    useShallow((state) => [state.setShowQueueMenu])
  );
  // refresh song info every ~5 seconds!
  useEffect(() => {
    const interval = setInterval(refreshQueue, 5000);
    return () => clearInterval(interval);
  }, [refreshQueue]);

  const openQueueTrackMenu = useCallback(() => {
    setShowQueueMenu(true);
  }, [setShowQueueMenu]);

  return (
    <LeftBorderGrid container direction="column" gap="2%" height="100%">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignContent="center"
      >
        <StyledText name="header">up next...</StyledText>
        {isHost && (
          <Tooltip title="Add to Queue">
            <IconButton onClick={openQueueTrackMenu}>
              <StyledAdd />
            </IconButton>
          </Tooltip>
        )}
      </Grid>
      <TrackFade
        container
        overflow="hidden"
        direction="column"
        justifyContent="start"
        gap="1%"
        size="grow"
      >
        {!isLoadingQueue &&
          data &&
          data.queue.map((track) => <QueueTrack track={track} />)}
      </TrackFade>
    </LeftBorderGrid>
  );
};

const QueueTrack: React.FC<{ track: Spotify.Track }> = ({ track }) => {
  return (
    <Grid container gap="5%" key={track.id}>
      <Grid container size={2}>
        <SquareImage src={track.album.images[0].url} />
      </Grid>
      <Grid container direction="column" size={9} justifyContent="center">
        <StyledText name="body" lineClamp={1}>
          {track.name}
        </StyledText>
        <StyledText name="body" lineClamp={1}>
          {getArtistsString(track.artists)}
        </StyledText>
      </Grid>
    </Grid>
  );
};

export default Queue;
