import styled from "@emotion/styled";

export const RootDiv = styled.div`
  position: relative;
`;

export const ElementContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
`;

export const Blank = styled.div<{ blankHeightPx: number }>`
  background-color: black;
  width: 100%;
  height: ${({ blankHeightPx }) => `${blankHeightPx}px`};
`;
