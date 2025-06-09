import StyledText from "./StyledText";
import { Flex } from "./Flex";

const LogoHeader: React.FC<{ widthInPx?: number }> = ({ widthInPx = 20 }) => {
  return (
    <Flex justifyContent="start" gap="10px">
      <img
        src="../../../static/favicon.png"
        height={widthInPx}
        width={widthInPx}
      />
      <StyledText name="body">house party!</StyledText>
    </Flex>
  );
};

export default LogoHeader;
