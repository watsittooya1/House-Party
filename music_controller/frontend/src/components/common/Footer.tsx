import styled from "@emotion/styled";
import StyledText from "./StyledText";
import { Flex } from "./Flex";

const StyledFlex = styled(Flex)`
  position: absolute;
  right: 1%;
  bottom: 1%;
`;

export const Footer: React.FC = () => {
  return (
    <StyledFlex gap="5px">
      <StyledText name="subsubtitle">
        powered by Spotify, created by chris y
      </StyledText>
    </StyledFlex>
  );
};
