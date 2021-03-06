import styled from "@emotion/styled";
import useIntersectionObserver from "optimized-infinite-scroll/hooks/useIntersectionObserver";
import { VDOMInterface } from "optimized-infinite-scroll/hooks/useVDOM/useVDOM";
import { getDividedElementsByColumn } from "optimized-infinite-scroll/util/common";
import React, { ReactNode, useEffect, useState } from "react";
import { GetNewData } from "types";

interface Props {
  vDOM: VDOMInterface;
  getNewData: GetNewData;
}

const NewDataFetching = ({ vDOM, getNewData }: Props) => {
  const [isDataFetching, setIsDataFetching] = useState(false);

  const endElementRef = useIntersectionObserver(async () => {
    const isEndElementInViewPort =
      vDOM.vElementsInViewPort[vDOM.vElementsInViewPort.length - 1] ||
      vDOM.vElementsInViewPort.length === 0;

    if (isEndElementInViewPort && !isDataFetching) {
      setIsDataFetching(true);
      await getNewData();
      setIsDataFetching(false);
    }
  }, [vDOM.vElementsInViewPort]);

  return <EndElement ref={endElementRef}></EndElement>;
};

export const EndElement = styled.div`
  opacity: 0;
  height: 50px;
`;

export default NewDataFetching;
