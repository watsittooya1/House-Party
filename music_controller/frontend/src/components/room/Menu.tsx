import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { Flex } from "../../components/common/Flex";
import colorScheme from "../../utility/colorScheme";
import { StyledButton } from "../../components/common/StyledButton";
import { useLeaveRoomMutation } from "../../api/housePartyApi";
import { useNavigate } from "react-router-dom";
import {
  addQueryParam,
  removeQueryParam,
  useQueryParams,
} from "../../utility/queryParams";
import { Dialog, dialogClasses, backdropClasses, Slide } from "@mui/material";

const StyledDialog = styled(Dialog)`
  ${`& .${dialogClasses.paper}`} {
    width: fit-content;
    max-width: fit-content;
    position: absolute;
    left: 0;
    margin: 0;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
  ${`& .${backdropClasses.root}`} {
    background-color: transparent;
  }
`;

const MenuContainer = styled(Flex)`
  background-color: ${colorScheme.darkGray};
`;

const Menu: React.FC<{
  isHost: boolean;
  show: boolean;
  onCloseMenu: () => void;
}> = ({ isHost, show, onCloseMenu }) => {
  const navigate = useNavigate();
  const [leaveRoom] = useLeaveRoomMutation();
  const [showQueue] = useQueryParams(["showQueue"]);

  const handleLeaveRoom = useCallback(async () => {
    await leaveRoom();
    navigate("/");
  }, [leaveRoom, navigate]);

  const openEditRoomDialog = useCallback(() => {
    navigate(`?${addQueryParam("editRoom", "true")}`);
    onCloseMenu();
  }, [navigate, onCloseMenu]);

  const toggleShowQueue = useCallback(() => {
    if (showQueue) {
      navigate(`?${removeQueryParam("showQueue")}`);
    } else {
      navigate(`?${addQueryParam("showQueue", "true")}`);
    }
    onCloseMenu();
  }, [showQueue, navigate, onCloseMenu]);

  return (
    <Slide direction="right" in={!!show}>
      <StyledDialog open onClose={onCloseMenu}>
        <MenuContainer direction="column" alignItems="flex-start">
          <StyledButton onClick={onCloseMenu} padding="0px 8px" fontSize="24px">
            close menu
          </StyledButton>
          {isHost && (
            <StyledButton
              onClick={openEditRoomDialog}
              padding="0px 8px"
              fontSize="24px"
            >
              edit room settings
            </StyledButton>
          )}
          <StyledButton
            onClick={toggleShowQueue}
            padding="0px 8px"
            fontSize="24px"
          >
            toggle show queue
          </StyledButton>
          <StyledButton
            onClick={handleLeaveRoom}
            padding="0px 8px"
            fontSize="24px"
          >
            {isHost ? "close room" : "leave room"}
          </StyledButton>
        </MenuContainer>
      </StyledDialog>
    </Slide>
  );
};

export default Menu;
