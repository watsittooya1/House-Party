import React, { useCallback, useState } from "react";
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
import { useShallow } from "zustand/shallow";
import { useRoomStore } from "../../store/roomStore";
import StyledText from "../common/StyledText";

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

const ConfirmationDialog = styled(Dialog)`
  margin: auto;

  ${`& .${dialogClasses.paper}`} {
    border-radius: 16px;
    background-color: ${colorScheme.darkGray};
    padding: 5%;
    width: 348px;
  }
  ${`& .${backdropClasses.root}`} {
    background-color: transparent;
  }
`;

const MenuContainer = styled(Flex)`
  background-color: ${colorScheme.darkGray};
`;

const Menu: React.FC<{
  show: boolean;
  onCloseMenu: () => void;
}> = ({ show, onCloseMenu }) => {
  const navigate = useNavigate();
  const [leaveRoom] = useLeaveRoomMutation();
  const [showQueue] = useQueryParams(["showQueue"]);
  const [isHost, setShowSettings] = useRoomStore(
    useShallow((state) => [state.isHost, state.setShowSettings])
  );

  const [showConfirm, setShowConfirm] = useState(false);

  const handleLeaveRoom = useCallback(async () => {
    await leaveRoom();
    navigate("/");
  }, [leaveRoom, navigate]);

  const openEditRoomDialog = useCallback(() => {
    setShowSettings(true);
    onCloseMenu();
  }, [setShowSettings, onCloseMenu]);

  const toggleShowQueue = useCallback(() => {
    if (showQueue) {
      navigate(`?${removeQueryParam("showQueue")}`);
    } else {
      navigate(`?${addQueryParam("showQueue", "true")}`);
    }
    onCloseMenu();
  }, [showQueue, navigate, onCloseMenu]);

  const handleCloseRoomClick = () => {
    if (isHost) {
      setShowConfirm(true);
    } else {
      handleLeaveRoom();
    }
  };

  const handleConfirmClose = async () => {
    setShowConfirm(false);
    await handleLeaveRoom();
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <Slide direction="right" in={!!show}>
        <StyledDialog open onClose={onCloseMenu}>
          <MenuContainer direction="column" alignItems="flex-start">
            <StyledButton
              onClick={onCloseMenu}
              padding="0px 8px"
              fontSize="24px"
            >
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
              onClick={handleCloseRoomClick}
              padding="0px 8px"
              fontSize="24px"
            >
              {isHost ? "close room" : "leave room"}
            </StyledButton>
          </MenuContainer>
        </StyledDialog>
      </Slide>
      <ConfirmationDialog open={showConfirm} onClose={handleCancelClose}>
        <Flex
          gap="16px"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <StyledText name="body" textAlign="center">
            are you sure you want to close this room? all guests will be
            removed.
          </StyledText>
          <Flex direction="column">
            <StyledButton onClick={handleCancelClose}>cancel</StyledButton>
            <StyledButton onClick={handleConfirmClose}>
              yes, close room
            </StyledButton>
          </Flex>
        </Flex>
      </ConfirmationDialog>
    </>
  );
};

export default Menu;
