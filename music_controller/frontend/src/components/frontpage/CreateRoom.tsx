import { IconButton, Stack, Switch } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { StyledButton } from "../common/StyledButton";
import { useShallow } from "zustand/shallow";
import StyledText from "../common/StyledText";
import { type ChangeEvent, useCallback, useState } from "react";
import { useFrontPageStore } from "../../store/frontPageStore";
import { useCreateRoomMutation } from "../../api/housePartyApi";
import { useNavigate } from "react-router-dom";

const CreateRoom: React.FC = () => {
  const [createRoom] = useCreateRoomMutation();
  const [setStage] = useFrontPageStore(useShallow((state) => [state.setStage]));
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [guestCanQueue, setGuestCanQueue] = useState(false);

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
      // todo: handle room creation failure
      throw Error("asdf");
    }

    navigate(`room/${response.data.code}`);
  }, [votesToSkip, guestCanPause, guestCanQueue, createRoom, navigate]);

  // function handleUpdateButtonPressed() {
  //   const requestOptions = {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       votes_to_skip: _votesToSkip,
  //       guest_can_pause: _guestCanPause,
  //       guest_can_queue: _guestCanQueue,
  //       code: roomCode,
  //     }),
  //   };
  //   fetch("/api/update-room", requestOptions).then((response) => {
  //     if (response.ok) {
  //       setSuccessMsg("Room updated successfully!");
  //     } else {
  //       setErrorMsg("Error updating room...");
  //     }
  //     updateCallback();
  //   });
  // }

  return (
    <Stack spacing={1}>
      <StyledText name="header">Room Settings</StyledText>
      <StyledText name="body">votes to skip</StyledText>

      <IconButton onClick={increaseVotesToSkip}>
        <ArrowDropUpIcon />
      </IconButton>
      <StyledText name="body">{votesToSkip}</StyledText>
      <IconButton onClick={decreaseVotesToSkip}>
        <ArrowDropDownIcon />
      </IconButton>
      <StyledText name="body">allow guests to pause/play</StyledText>
      <Switch
        checked={guestCanPause}
        onChange={(_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
          setGuestCanPause(checked);
        }}
      />
      <StyledText name="body">allow guests to queue songs</StyledText>
      <Switch
        checked={guestCanQueue}
        onChange={(_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
          setGuestCanQueue(checked);
        }}
      />
      <StyledButton onClick={handleCreateRoom}>create room</StyledButton>
      <StyledButton
        onClick={() => {
          setStage("FrontPage");
        }}
      >
        back
      </StyledButton>
    </Stack>
  );
};

export default CreateRoom;
