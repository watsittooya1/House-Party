import { Stack } from "@mui/material";
import { StyledButton } from "../common/StyledButton";
import { useShallow } from "zustand/shallow";
import { useFrontPageStore } from "../../store/FrontPageStore";
import StyledText from "../common/StyledText";

const CreateRoom: React.FC = () => {
  const [setStage] = useFrontPageStore(useShallow((state) => [state.setStage]));

  return (
    <Stack spacing={1}>
      <StyledText name="h4">Room Settings</StyledText>
      <StyledText name="p">votes to skip</StyledText>
      <StyledText name="p">allow guest to pause/play</StyledText>
      <StyledText name="p">allow guests to queue songs</StyledText>
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
