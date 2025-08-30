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
import LogoHeader from "../../../components/common/LogoHeader";

const StyledRight = styled(KeyboardArrowRightIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const MenuIconButton = styled(IconButton)`
  position: absolute;
  left: 0%;
`;

const RoomCode = styled(Flex)`
  /* position: absolute;
  top: 5%;
  left: ${musicPlayerWidth / 2 - 3}%; */
`;

const Room: React.FC = () => {
  const [showQueue] = useQueryParams(["showQueue"]);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const { data: roomResponse, isLoading: roomIsLoading } =
    useGetCurrentRoomQuery();
  const { data: tokenResponse } = useGetHostTokenQuery();
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

  return (
    <PageGrid>
      {tokenResponse && <WebPlayback token={tokenResponse.token} />}
      <Menu show={menuIsOpen} onCloseMenu={() => setMenuIsOpen(false)} />
      <RoomSettingsDialog />
      {showQueue && <QueueMenu />}

      <Tooltip title="Open Menu">
        <MenuIconButton onClick={() => setMenuIsOpen(true)}>
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
        <Flex direction="column" alignItems="flex-start">
          <LogoHeader />
          <RoomCode width="100%" direction="column" justifyContent="center">
            <StyledText name="subtitle">{`code`}</StyledText>
            <StyledText name="header">{roomResponse?.code}</StyledText>
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
