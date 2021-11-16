import styled from "@emotion/styled";

export const RootDiv = styled.div`
  position: relative;
`;

export const Row = styled.div`
  display: flex;
`;

export const Blank = styled.div<{ blankHeightPx: number }>`
  background-color: black;
  width: 100%;
  height: ${({ blankHeightPx }) => `${blankHeightPx}px`};
`;
