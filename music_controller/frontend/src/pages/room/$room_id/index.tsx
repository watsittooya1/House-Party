import React, { useEffect, useState } from "react";
import { Grid, IconButton, Tooltip } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styled from "@emotion/styled";
import { PageGrid } from "../../../components/common/PageGrid";
import colorScheme from "../../../utility/colorScheme";
import { useQueryParams } from "../../../utility/queryParams";
import MusicPlayer from "../../../components/room/MusicPlayer";
import Queue from "../../../components/room/Queue";
import Menu from "../../../components/room/Menu";
import QueueMenu from "../../../components/room/QueueMenu";
import { useGetCurrentRoomQuery } from "../../../api/housePartyApi";
import { useNavigate } from "react-router-dom";
import { useGetHostTokenQuery } from "../../../api/spotifyApi";
import WebPlayback from "../../../components/room/WebPlayback";
import RoomSettingsDialog from "../../../components/room/RoomSettingsDialog";
import { musicPlayerWidth, queueWidth } from "../../../utility/dimensions";
import StyledText from "../../../components/common/StyledText";
import { Flex } from "../../../components/common/Flex";
import { useShallow } from "zustand/shallow";
import { useRoomStore } from "../../../store/roomStore";

const StyledRight = styled(KeyboardArrowRightIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const MenuIconButton = styled(IconButton)`
  position: absolute;
  left: 0%;
`;

const RoomCode = styled(Flex)`
  position: absolute;
  top: 8%;
`;

const Room: React.FC = () => {
  const [showQueue] = useQueryParams(["showQueue"]);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { data: roomResponse, isLoading: roomIsLoading } =
    useGetCurrentRoomQuery();
  const { data: tokenResponse } = useGetHostTokenQuery();
  const [showSettings, showQueueMenu, setRoomState] = useRoomStore(
    useShallow((state) => [
      state.showSettings,
      state.showQueueMenu,
      state.setRoomSettings,
    ])
  );
  const navigate = useNavigate();

  // if the user is not in a room, boot them to the front page
  useEffect(() => {
    if (
      !roomIsLoading &&
      (roomResponse?.code == undefined || roomResponse?.code == null)
    ) {
      navigate("/");
    }
  }, [roomIsLoading, roomResponse, navigate]);

  // update room state
  useEffect(() => {
    if (roomResponse?.code != undefined) {
      setRoomState(roomResponse);
    }
  }, [roomResponse, setRoomState]);

  return (
    <PageGrid>
      {tokenResponse && <WebPlayback token={tokenResponse.token} />}
      <Menu show={showMenu} onCloseMenu={() => setShowMenu(false)} />
      <RoomSettingsDialog show={showSettings} />
      <QueueMenu show={showQueueMenu} />

      <Tooltip title="Open Menu">
        <MenuIconButton onClick={() => setShowMenu(true)}>
          <StyledRight />
        </MenuIconButton>
      </Tooltip>

      <Grid
        height="100%"
        width={showQueue ? `${musicPlayerWidth}%` : "100%"}
        alignContent="center"
        direction="column"
        spacing={2}
      >
        <Flex direction="column" alignItems="center" justifyContent="center">
          <RoomCode direction="column" justifyContent="center">
            <StyledText name="subtitle">{`code`}</StyledText>
            <StyledText name="header">{roomResponse?.code}</StyledText>
            {roomResponse?.is_host && (
              <StyledText name="subsubtitle">you are host</StyledText>
            )}
          </RoomCode>
        </Flex>
        <MusicPlayer />
      </Grid>

      {showQueue && (
        <Grid height="100%" width={`${queueWidth}%`}>
          <Queue />
        </Grid>
      )}
    </PageGrid>
  );
};

export default Room;
