import React, { ReactNode, useRef } from "react";
import useIntersectionObserver from "./hooks/useIntersectionObserver";
import { EndElement, Row } from "./InfiniteScroll.styles";
import { getDividedElementsByColumn } from "./util/common";

interface Props {
  children: ReactNode;
  getNewData: () => void;
  column: number;
  className?: string;
}

const isArrayLike = (
  arrayLike: ReactNode
): arrayLike is ArrayLike<ReactNode> => {
  return (arrayLike as any)?.length === undefined ? false : true;
};

const InfiniteScroll = ({
  children = [],
  getNewData,
  column,
  className,
}: Props) => {
  const endElementRef = useIntersectionObserver(getNewData);

  if (!isArrayLike(children)) {
    return null;
  }

  const rows = getDividedElementsByColumn<ReactNode>(children, column);

  return (
    <div className={className}>
      {rows.map((row) => {
        return <Row>{row}</Row>;
      })}

      <EndElement ref={endElementRef}></EndElement>
    </div>
  );
};

export default InfiniteScroll;
