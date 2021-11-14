import React, { ReactNode } from "react";
import ActualDOM from "./components/ActualDOM/ActualDOM";
import useIntersectionObserver from "./hooks/useIntersectionObserver";
import useVDOM from "./hooks/useVDOM";
import { EndElement, RootDiv } from "./InfiniteScroll.styles";

interface Props {
  children: ReactNode[];
  getNewData: () => void;
  column: number;
  className?: string;
}

const InfiniteScroll = ({
  children = [],
  getNewData,
  column,
  className,
}: Props) => {
  // TODO: VDOM context API로 만들기
  const vDOM = useVDOM({ column });
  const endElementRef = useIntersectionObserver(() => {
    const isEndElementInViewPort =
      vDOM.virtualElements[vDOM.virtualElements.length - 1] ||
      vDOM.virtualElements.length === 0;

    if (isEndElementInViewPort) {
      getNewData();
    }
  });

  return (
    <RootDiv className={className}>
      <ActualDOM column={column} vDOM={vDOM}>
        {children}
      </ActualDOM>

      <EndElement ref={endElementRef}></EndElement>
    </RootDiv>
  );
};

export default InfiniteScroll;
