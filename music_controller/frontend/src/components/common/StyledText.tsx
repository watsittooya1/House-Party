import { type PropsWithChildren } from "react";
import colorScheme from "../../utility/colorScheme";
import styled from "@emotion/styled";

export type TypographyType = "title" | "header" | "body";

type Typography = {
  fontSize: number;
};

const TypographyDict: { [T in TypographyType]: Typography } = {
  title: {
    fontSize: 50,
  },
  header: {
    fontSize: 30,
  },
  body: {
    fontSize: 20,
  },
};

const Text = styled.p<{ name: TypographyType; bold?: boolean }>`
  color: ${colorScheme.gray};
  font-family: Helvetica;
  font-size: ${({ name }) => TypographyDict[name].fontSize}px;
  font-weight: ${({ bold }) => (bold ? 700 : 500)};
  text-transform: none;
  margin: 0; // text tags seem to have preset margins
`;

const StyledText: React.FC<
  { name: TypographyType; bold?: boolean } & PropsWithChildren
> = ({ name, bold, children }) => {
  return (
    <Text name={name} bold={bold}>
      {children}
    </Text>
  );
};

export default StyledText;
