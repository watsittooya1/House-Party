import { IconButton, Switch } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { StyledButton } from "../common/StyledButton";
import { useShallow } from "zustand/shallow";
import StyledText from "../common/StyledText";
import { type ChangeEvent, useCallback, useState } from "react";
import { useFrontPageStore } from "../../store/FrontPageStore";
import { useCreateRoomMutation } from "../../api/housePartyApi";
import { useNavigate } from "react-router-dom";
import { Flex } from "../common/Flex";
import styled from "@emotion/styled";
import colorScheme from "../../utility/colorScheme";
import useNotifications from "../../utility/notifications";

const TitleContainer = styled(Flex)`
  border-bottom: 2px ${colorScheme.gray} solid;
`;

const StyledIconButton = styled(IconButton)`
  padding: 0;
`;

const VotesContainer = styled(Flex)`
  padding-right: 16px;
`;

const CreateRoom: React.FC = () => {
  const [createRoom, { isLoading }] = useCreateRoomMutation();
  const [setStage] = useFrontPageStore(useShallow((state) => [state.setStage]));
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

  const handleCreateRoom = useCallback(async () => {
    const response = await createRoom({
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

    navigate(`room/${response.data.code}`);
    setStage("FrontPage");
  }, [
    addNotification,
    votesToSkip,
    guestCanPause,
    guestCanQueue,
    createRoom,
    navigate,
    setStage,
  ]);

  return (
    <Flex width="316px" gap="16px" direction="column">
      <TitleContainer justifyContent="center" width="100%">
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
        <StyledText name="body">guests can pause/play</StyledText>
        <Switch
          checked={guestCanPause}
          onChange={(_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            setGuestCanPause(checked);
          }}
        />
      </Flex>
      <Flex direction="row" width="100%" justifyContent="space-between">
        <StyledText name="body">guests can queue songs</StyledText>
        <Switch
          checked={guestCanQueue}
          onChange={(_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            setGuestCanQueue(checked);
          }}
        />
      </Flex>
      <Flex direction="column">
        <StyledButton onClick={handleCreateRoom} disabled={isLoading}>
          {isLoading ? "creating..." : "create room"}
        </StyledButton>
        <StyledButton
          onClick={() => {
            setStage("FrontPage");
          }}
        >
          cancel
        </StyledButton>
      </Flex>
    </Flex>
  );
};

export default CreateRoom;
