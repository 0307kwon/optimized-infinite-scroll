import React, { ReactNode } from "react";
import ActualDOM from "./components/ActualDOM/ActualDOM";
import useIntersectionObserver from "./hooks/useIntersectionObserver";
import useVDOM from "./hooks/useVDOM";
import { EndElement } from "./InfiniteScroll.styles";

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
  const endElementRef = useIntersectionObserver(getNewData);
  // TODO: VDOM context API로 만들기
  const vDOM = useVDOM({ column });

  return (
    <div className={className}>
      <ActualDOM column={column} vDOM={vDOM}>
        {children}
      </ActualDOM>

      <EndElement ref={endElementRef}></EndElement>
    </div>
  );
};

export default InfiniteScroll;
