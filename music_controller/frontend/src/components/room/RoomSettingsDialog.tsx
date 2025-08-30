import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Dialog,
  dialogClasses,
  IconButton,
  Slide,
  Switch,
} from "@mui/material";
import styled from "@emotion/styled";
import colorScheme from "../../utility/colorScheme";
import { Flex } from "../common/Flex";
import { type ChangeEvent, useCallback, useState } from "react";
import { StyledButton } from "../common/StyledButton";
import StyledText from "../common/StyledText";
import { useNavigate } from "react-router-dom";
import { useUpdateRoomMutation } from "../../api/housePartyApi";
import { removeQueryParam, useQueryParams } from "../../utility/queryParams";
import useNotifications from "../../utility/notifications";

const TitleContainer = styled(Flex)`
  border-bottom: 2px ${colorScheme.gray} solid;
`;

const StyledDialog = styled(Dialog)`
  margin: auto;

  ${`& .${dialogClasses.paper}`} {
    border-radius: 16px;
    background-color: ${colorScheme.darkGray};
    padding: 5%;
    width: 348px;
  }
`;

const StyledIconButton = styled(IconButton)`
  padding: 0;
`;

const VotesContainer = styled(Flex)`
  padding-right: 16px;
`;

const RoomSettingsDialog: React.FC = () => {
  const [show] = useQueryParams(["editRoom"]);
  const [updateRoom, { isLoading }] = useUpdateRoomMutation();
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [guestCanQueue, setGuestCanQueue] = useState(false);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const increaseVotesToSkip = useCallback(() => {
    if (votesToSkip < 5) setVotesToSkip(votesToSkip + 1);
  }, [votesToSkip, setVotesToSkip]);

  const decreaseVotesToSkip = useCallback(() => {
    if (votesToSkip > 1) setVotesToSkip(votesToSkip - 1);
  }, [votesToSkip, setVotesToSkip]);

  const closeDialog = useCallback(() => {
    navigate(`?${removeQueryParam("editRoom")}`);
  }, [navigate]);

  const handleUpdateRoom = useCallback(async () => {
    const response = await updateRoom({
      votes_to_skip: votesToSkip,
      guest_can_pause: guestCanPause,
      guest_can_queue: guestCanQueue,
    });

    if (!("data" in response) || response.data == null) {
      addNotification({
        message: "Failed to update room settings.",
      });
      return;
    }
    closeDialog();
  }, [
    votesToSkip,
    guestCanPause,
    guestCanQueue,
    updateRoom,
    closeDialog,
    addNotification,
  ]);

  return (
    <Slide direction="up" in={!!show}>
      <StyledDialog open hideBackdrop>
        <Flex gap="16px" direction="column">
          <TitleContainer justifyContent="center" width="80%">
            <StyledText name="header">room settings</StyledText>
          </TitleContainer>
          <Flex direction="row" width="100%" justifyContent="space-between">
            <StyledText name="body">votes to skip</StyledText>

            <VotesContainer direction="column">
              <StyledIconButton onClick={increaseVotesToSkip}>
                <ArrowDropUpIcon />
              </StyledIconButton>
              <StyledText name="body">{votesToSkip}</StyledText>
              <StyledIconButton onClick={decreaseVotesToSkip}>
                <ArrowDropDownIcon />
              </StyledIconButton>
            </VotesContainer>
          </Flex>
          <Flex direction="row" width="100%" justifyContent="space-between">
            <StyledText name="body">allow guests to pause/play</StyledText>
            <Switch
              checked={guestCanPause}
              onChange={(
                _e: ChangeEvent<HTMLInputElement>,
                checked: boolean
              ) => {
                setGuestCanPause(checked);
              }}
            />
          </Flex>
          <Flex direction="row" width="100%" justifyContent="space-between">
            <StyledText name="body">allow guests to queue songs</StyledText>
            <Switch
              checked={guestCanQueue}
              onChange={(
                _e: ChangeEvent<HTMLInputElement>,
                checked: boolean
              ) => {
                setGuestCanQueue(checked);
              }}
            />
          </Flex>
          <Flex direction="column">
            <StyledButton onClick={handleUpdateRoom} disabled={isLoading}>
              {isLoading ? "updating..." : "update room settings"}
            </StyledButton>
            <StyledButton onClick={closeDialog}>cancel</StyledButton>
          </Flex>
        </Flex>
      </StyledDialog>
    </Slide>
  );
};

export default RoomSettingsDialog;
