import React, { ReactNode, useState } from "react";
import ActualDOM from "./components/ActualDOM/ActualDOM";
import useIntersectionObserver from "./hooks/useIntersectionObserver";
import useVDOM from "./hooks/useVDOM";
import { EndElement, RootDiv } from "./InfiniteScroll.styles";

interface Props {
  children: ReactNode[];
  getNewData: () => Promise<unknown>;
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
  const [isDataLoading, setIsDataLoading] = useState(false);
  const endElementRef = useIntersectionObserver(async () => {
    const isEndElementInViewPort =
      vDOM.virtualElements[vDOM.virtualElements.length - 1] ||
      vDOM.virtualElements.length === 0;

    if (isEndElementInViewPort && !isDataLoading) {
      setIsDataLoading(true);
      await getNewData();
      setIsDataLoading(false);
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
