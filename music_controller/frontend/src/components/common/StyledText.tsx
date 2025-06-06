import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { PropsWithChildren } from "react";
import colorScheme from "../../utility/colorScheme";

export type Typography = "h3" | "h4" | "h5" | "h6" | "p";

const StyledText: React.FC<
  { name: Typography; bold?: boolean } & PropsWithChildren
> = ({ name, bold, children }) => {
  const styling = css`
    color: ${colorScheme.gray};
    font-family: Helvetica;
    font-size: 30px;
    font-weight: ${bold ? 700 : 500};
    text-transform: none;
  `;

  const Tag = getTypographyTag(name);

  return <Tag css={styling}>{children}</Tag>;
};

function getTypographyTag(name: Typography): React.ElementType {
  switch (name) {
    case "h3":
      return styled.h3``;
    case "h4":
      return styled.h4``;
    case "h5":
      return styled.h5``;
    case "h6":
      return styled.h6``;
    default:
      return styled.p``;
  }
}

export default StyledText;
