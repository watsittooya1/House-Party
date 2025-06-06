import { Stack } from "@mui/material";
import { StyledButton } from "../common/StyledButton";
import { useShallow } from "zustand/shallow";
import { useFrontPageStore } from "../../store/FrontPageStore";
import StyledText from "../common/StyledText";

const JoinRoom: React.FC = () => {
  const [setStage] = useFrontPageStore(useShallow((state) => [state.setStage]));

  return (
    <Stack spacing={1}>
      <StyledText name="h4">enter room code</StyledText>
      <StyledText name="p">CHRIS PLACE A TEXTFIELD HERE</StyledText>
      <StyledButton onClick={() => {}}>join room</StyledButton>
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

export default JoinRoom;
