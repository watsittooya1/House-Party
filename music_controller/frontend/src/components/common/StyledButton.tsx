import { Button } from "@mui/material";
import styled from "@emotion/styled";
import colorScheme from "../../utility/colorScheme";

export const StyledButton = styled(Button)<{ fontSize?: number }>`
  font-family: Helvetica;
  text-transform: none;
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : "30px")};
  font-weight: 700;
  color: ${colorScheme.white};
  :hover {
    color: ${colorScheme.gray};
  }
`;
