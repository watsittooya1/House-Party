import styled from "@emotion/styled";

type FlexProps = {
  direction?: "row" | "column";
  alignItems?: "flex-end" | "stretch" | "center" | "flex-start";
  justifyContent?: "start" | "center" | "flex-end" | "space-between";
  gap?: string;
  width?: string;
  height?: string;
  grow?: string;
  shrink?: string;
};

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction ?? "row"};
  align-items: ${({ alignItems }) => alignItems ?? "center"};
  justify-content: ${({ justifyContent }) => justifyContent ?? "start"};
  ${({ gap }) => (gap != null ? `gap: ${gap};` : "")}
  ${({ width }) => (width != null ? `width: ${width};` : "")}
  ${({ height }) => (height != null ? `height: ${height};` : "")}
  ${({ grow }) => (grow != null ? `flex-grow: ${grow};` : "")}
  ${({ shrink }) => (shrink != null ? `flex-shrink: ${shrink};` : "")}
`;
