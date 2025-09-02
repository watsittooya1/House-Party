import { Button } from "@mui/material";
import styled from "@emotion/styled";
import colorScheme, { hexToRgba } from "../../utility/colorScheme";

export const StyledButton = styled(Button)<{
  fontSize?: string;
  padding?: string;
}>`
  ${({ padding }) => padding && `padding: ${padding};`}

  font-family: Helvetica;
  text-transform: none;
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : "30px")};
  font-weight: 700;
  color: ${colorScheme.white};
  :hover {
    color: ${colorScheme.gray};
    background-color: ${hexToRgba(colorScheme.darkGray, 0.1)};
  }
  ${"&.MuiTouchRipple-child"} {
    background-color: ${hexToRgba(colorScheme.darkGray, 0.5)};
  }
`;
