import { styled } from "@mui/material";
import { Flex } from "./Flex";
import StyledText from "./StyledText";

const Container = styled(Flex)`
  justify-content: start;
  gap: 10px;
  position: absolute;
  top: 5%;
  left: 5%;
`;

const LogoHeader: React.FC = () => {
  return (
    <Container>
      <img
        src="../../../static/houseparty_small.png"
        height="20px"
        width="20px"
      />
      <StyledText name="body">house party!</StyledText>
    </Container>
  );
};

export default LogoHeader;
