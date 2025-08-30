import { IconButton, Tooltip } from "@mui/material";
import { useAddToQueueMutation } from "../../api/spotifyApi";
import { useCallback } from "react";
import { getArtistsString } from "../../utility/util";
import colorScheme from "../../utility/colorScheme";
import { Flex } from "../common/Flex";
import AddIcon from "@mui/icons-material/Add";
import StyledText from "../common/StyledText";
import styled from "@emotion/styled";
import useNotifications from "../../utility/notifications";

const StyledAdd = styled(AddIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const AlbumCover = styled.img`
  height: 100%;
  aspect-ratio: 1;
`;

const TrackSearchResult: React.FC<{ track: Spotify.Track }> = ({ track }) => {
  const [addToQueue] = useAddToQueueMutation();
  const { addNotification } = useNotifications();

  // cy TODO: error message/toast for unsuccessful add
  const handleAddToQueue = useCallback(() => {
    addToQueue({ uri: track.uri });
    addNotification({
      message: "Track added to queue!",
    });
  }, [track.uri, addToQueue, addNotification]);

  return (
    <Flex
      key={track.uri}
      width="98%"
      height="8%"
      justifyContent="space-between"
    >
      <Flex height="100%" direction="row" gap="2%" grow="1">
        <AlbumCover src={track.album.images[0].url} />
        <Flex direction="column" alignItems="flex-start">
          <StyledText name="header" lineClamp={1}>
            {track.name}
          </StyledText>
          <StyledText name="body" lineClamp={1}>
            {getArtistsString(track)}
          </StyledText>
        </Flex>
      </Flex>
      <Tooltip title="Add Track to Queue">
        <IconButton onClick={handleAddToQueue}>
          <StyledAdd />
        </IconButton>
      </Tooltip>
    </Flex>
  );
};

export default TrackSearchResult;
