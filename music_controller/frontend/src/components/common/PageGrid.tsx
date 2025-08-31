import { type PropsWithChildren } from "react";
import colorScheme from "../../utility/colorScheme";
import styled from "@emotion/styled";
import { Grid } from "@mui/material";
import { pageGridPadding } from "../../utility/dimensions";
import LogoHeader from "../common/LogoHeader";

const Background = styled(Grid)<{ justify?: string; align?: string }>`
  background-image: radial-gradient(${colorScheme.darkGray}, #121212);
  height: 100%;
  justify-content: ${({ justify }) => justify ?? "center"};
  align-items: ${({ align }) => align ?? "center"};
  padding: ${`${pageGridPadding}%`};
`;

export const PageGrid: React.FC<
  {
    direction?: "row" | "column";
    justify?: string;
    align?: string;
    hideHeader?: boolean;
  } & PropsWithChildren
> = ({ direction = "row", justify, align, hideHeader = false, children }) => {
  return (
    <Background
      container
      direction={direction}
      rowSpacing={1}
      justify={justify}
      align={align}
    >
      {!hideHeader && <LogoHeader />}
      {children}
    </Background>
  );
};
