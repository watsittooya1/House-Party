import { type PropsWithChildren } from "react";
import { Flex } from "./Flex";
import colorScheme from "../../utility/colorScheme";
import styled from "@emotion/styled";

const Background = styled(Flex)<{ gap?: string }>`
  background-image: radial-gradient(${colorScheme.green}, #121212);
  height: 100vh;
  justify-content: center;
  align-items: center;
  ${({ gap }) => (gap ? `gap: ${gap}` : "")};
`;

export const Page: React.FC<
  { gap?: string; margin?: string } & PropsWithChildren
> = ({ gap, children }) => {
  return <Background gap={gap}>{children}</Background>;
};
