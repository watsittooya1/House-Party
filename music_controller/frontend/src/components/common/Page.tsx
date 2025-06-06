import { PropsWithChildren } from "react";
import { Flex } from "./Flex";
import colorScheme from "../../utility/colorScheme";
import styled from "@emotion/styled";

const Background = styled(Flex)`
  background-image: radial-gradient(${colorScheme.green}, #121212);
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export const Page: React.FC<PropsWithChildren> = ({ children }) => {
  return <Background>{children}</Background>;
};
