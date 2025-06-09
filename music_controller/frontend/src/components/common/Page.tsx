import { type PropsWithChildren } from "react";
import { Flex } from "./Flex";
import colorScheme from "../../utility/colorScheme";
import styled from "@emotion/styled";

const Background = styled(Flex)`
  background-image: radial-gradient(${colorScheme.green}, #121212);
  //width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const StyledFlex = styled(Flex)<{ gap?: string }>`
  width: 100%;
  height: 100%;
  ${({ gap }) => (gap ? `gap: ${gap}` : "")};
`;

export const Page: React.FC<
  { gap?: string; margin?: string } & PropsWithChildren
> = ({ gap, children }) => {
  return (
    <Background>
      <StyledFlex gap={gap}>{children}</StyledFlex>
    </Background>
  );
};
