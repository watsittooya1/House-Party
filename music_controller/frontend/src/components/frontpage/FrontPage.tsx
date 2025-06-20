import { Stack } from "@mui/material";
import { StyledButton } from "../common/StyledButton";
import { useShallow } from "zustand/shallow";
import { useFrontPageStore } from "../../store/frontPageStore";

const FrontPage: React.FC = () => {
  const [setStage] = useFrontPageStore(useShallow((state) => [state.setStage]));

  return (
    <Stack spacing={1}>
      <StyledButton onClick={() => setStage("Login")}>
        login to spotify
      </StyledButton>
      <StyledButton onClick={() => setStage("CreateRoom")}>
        start a room
      </StyledButton>
      <StyledButton onClick={() => setStage("JoinRoom")}>
        join a room
      </StyledButton>
    </Stack>
  );
};

export default FrontPage;
