import React, { ReactNode, useEffect, useState } from "react";
import { GetNewData } from "types";
import Element from "./components/Element";
import NewDataFetching from "./components/NewDataFetching";
import useDataInViewPortOnly from "./hooks/useDataInViewPortOnly";
import useNewData from "./hooks/useNewData";
import useVDOM from "./hooks/useVDOM";
import { Blank, ElementContainer, RootDiv } from "./InfiniteScroll.styles";
import "./prototypes.js";
import { getDividedElementsByColumn } from "./util/common";

interface Props {
  children: ReactNode[];
  getNewData: GetNewData;
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
  const [renderingElements, setRenderingElements] = useState<
    ReactNode[] | null
  >(null);
  const [overallHeightPx, setOverallHeightPx] = useState(0);
  const [blankHeightPx, setBlankHeightPx] = useState<{
    top: number;
    bottom: number;
  }>({
    top: 0,
    bottom: 0,
  });
  const vDOM = useVDOM({ column });
  const { dataInViewPort } = useDataInViewPortOnly({ vDOM });
  const { newData, isNewDataMounting } = useNewData({
    vDOM,
    children,
    renderingElements,
  });

  useEffect(() => {
    if (!isNewDataMounting) {
      // overallHeight 구하기
      // B만 구하면 됨

      const lastElementInVElement = vDOM.vElements.findLast(
        (element) => element
      );

      if (lastElementInVElement) {
        setOverallHeightPx(
          lastElementInVElement.yPositionPx + lastElementInVElement.heightPx
        );
      }
    }
  }, [isNewDataMounting]);

  useEffect(() => {
    if (!dataInViewPort) {
      return;
    }

    const firstElementInViewPort = vDOM.vElementsInViewPort.find(
      (element) => element
    );
    const lastElementInViewPort = vDOM.vElementsInViewPort.findLast(
      (element) => element
    );

    if (firstElementInViewPort && lastElementInViewPort) {
      setRenderingElements(dataInViewPort);
      setBlankHeightPx({
        top: firstElementInViewPort.yPositionPx,
        bottom:
          overallHeightPx -
          lastElementInViewPort.yPositionPx -
          lastElementInViewPort.heightPx,
      });
    }
  }, [dataInViewPort]);

  useEffect(() => {
    if (newData) {
      setRenderingElements(newData);
    }
  }, [newData]);

  return (
    <RootDiv className={className}>
      <Blank blankHeightPx={blankHeightPx.top} />
      <ElementContainer>
        {renderingElements &&
          renderingElements.map((element, index) => {
            return (
              element && (
                <Element vDOM={vDOM} vDOMKey={index}>
                  {element}
                </Element>
              )
            );
          })}
      </ElementContainer>
      <Blank blankHeightPx={blankHeightPx.bottom} />

      <NewDataFetching getNewData={getNewData} vDOM={vDOM} />
    </RootDiv>
  );
};

export default InfiniteScroll;
