import { Stack } from "@mui/material";
import { StyledButton } from "../common/StyledButton";
import { useShallow } from "zustand/shallow";
import { useFrontPageStore } from "../../store/frontPageStore";
import StyledText from "../common/StyledText";

const Login: React.FC = () => {
  const [setStage] = useFrontPageStore(useShallow((state) => [state.setStage]));

  return (
    <Stack spacing={1}>
      {/* TODO: make this ellipses animate 123! */}
      <StyledText name="header">authenticating...</StyledText>
      <StyledButton
        onClick={() => {
          setStage("FrontPage");
        }}
      >
        cancel
      </StyledButton>
    </Stack>
  );
};

export default Login;
