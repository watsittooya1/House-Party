import { type PropsWithChildren } from "react";
import colorScheme from "../../utility/colorScheme";
import styled from "@emotion/styled";

export type TypographyType = "title" | "header" | "body" | "subtitle";

type Typography = {
  fontSize: string;
};

const TypographyDict: { [T in TypographyType]: Typography } = {
  title: {
    fontSize: "50px",
  },
  header: {
    fontSize: "30px",
  },
  body: {
    fontSize: "20px",
  },
  subtitle: {
    fontSize: "16px",
  },
};

const Text = styled.p<{
  name: TypographyType;
  bold?: boolean;
  lineClamp?: number;
}>`
  color: ${colorScheme.gray};
  font-family: Helvetica;
  font-size: ${({ name }) => TypographyDict[name].fontSize};
  font-weight: ${({ bold }) => (bold ? 700 : 500)};
  text-transform: none;
  margin: 0; // p tags seem to have preset margins
  align-content: center;

  ${({ lineClamp }) =>
    lineClamp &&
    `overflow-wrap: break-word;
  -webkit-line-clamp: ${lineClamp};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  max-width: 100%;`}
`;

const StyledText: React.FC<
  {
    name: TypographyType;
    bold?: boolean;
    lineClamp?: number;
  } & PropsWithChildren
> = ({ name, bold, lineClamp, children }) => {
  return (
    <Text name={name} bold={bold} lineClamp={lineClamp}>
      {children}
    </Text>
  );
};

export default StyledText;
