import { Stack } from "@mui/material";
import { StyledButton } from "../common/StyledButton";
import { useShallow } from "zustand/shallow";
import { useFrontPageStore } from "../../store/FrontPageStore";
import StyledText from "../common/StyledText";

const CreateRoom: React.FC = () => {
  const [setStage] = useFrontPageStore(useShallow((state) => [state.setStage]));

  return (
    <Stack spacing={1}>
      <StyledText name="header">Room Settings</StyledText>
      <StyledText name="body">votes to skip</StyledText>
      <StyledText name="body">allow guest to pause/play</StyledText>
      <StyledText name="body">allow guests to queue songs</StyledText>
      <StyledButton onClick={() => {}}>create room</StyledButton>
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
