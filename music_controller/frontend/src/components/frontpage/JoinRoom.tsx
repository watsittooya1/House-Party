import { StyledButton } from "../common/StyledButton";
import { useShallow } from "zustand/shallow";
import { useFrontPageStore } from "../../store/FrontPageStore";
import StyledText from "../common/StyledText";
import { useJoinRoomMutation } from "../../api/housePartyApi";
import styled from "@emotion/styled";
import colorScheme from "../../utility/colorScheme";
import { Flex } from "../common/Flex";
import { StyledTextField } from "../common/StyledTextField";
import { ChangeEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../utility/notifications";

const TitleContainer = styled(Flex)`
  border-bottom: 2px ${colorScheme.gray} solid;
`;

const JoinRoom: React.FC = () => {
  const [setStage] = useFrontPageStore(useShallow((state) => [state.setStage]));
  const [roomError, setRoomError] = useState();
  const [roomCode, setRoomCode] = useState("");
  const [joinRoom, { isLoading }] = useJoinRoomMutation();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const handleJoinRoom = useCallback(async () => {
    const response = await joinRoom(roomCode);

    // error responses for: not found room, failed otherwise
    if (!("data" in response) || response.data == null) {
      addNotification({
        message: "Failed to join room.",
      });
      return;
    }

    navigate(`room/${response.data.code}`);
    setStage("FrontPage");
  }, [addNotification, joinRoom, navigate, roomCode, setStage]);

  return (
    <Flex width="316px" gap="16px" direction="column">
      <TitleContainer justifyContent="center" width="100%">
        <StyledText name="header">join room</StyledText>
      </TitleContainer>
      <StyledText name="header">enter a room code</StyledText>
      <StyledTextField
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setRoomError(undefined);
          setRoomCode(e.target.value);
        }}
        type="search"
        error={!!roomError}
        helperText={roomError}
      />
      <StyledButton onClick={handleJoinRoom} disabled={isLoading}>
        {isLoading ? "joining..." : "join room"}
      </StyledButton>
      <StyledButton
        onClick={() => {
          setStage("FrontPage");
        }}
      >
        cancel
      </StyledButton>
    </Flex>
  );
};

export default JoinRoom;
