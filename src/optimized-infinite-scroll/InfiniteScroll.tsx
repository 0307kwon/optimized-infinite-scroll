import React, { ReactNode, useEffect, useState } from "react";
import { GetNewData } from "types";
import Element from "./components/Element";
import NewDataFetching from "./components/NewDataFetching";
import useDataInViewPortOnly from "./hooks/useDataInViewPortOnly";
import useNewData from "./hooks/useNewData";
import useVDOM from "./hooks/useVDOM";
import { Blank, RootDiv, Row } from "./InfiniteScroll.styles";
import { getDividedElementsByColumn } from "./util/common";
import "./prototypes.js";

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
  const [renderingRows, setRenderingRows] = useState<ReactNode[][] | null>(
    null
  );
  const [overallHeightPx, setOverallHeightPx] = useState(0);
  const [blankHeightPx, setBlankHeightPx] = useState<{
    top: number;
    bottom: number;
  }>({
    top: 0,
    bottom: 0,
  });
  const vDOM = useVDOM({ column });
  const { newData, isNewDataMounting } = useNewData({
    vDOM,
    children,
    renderingRows,
  });
  const { dataInViewPort } = useDataInViewPortOnly({ vDOM });

  useEffect(() => {
    if (!isNewDataMounting) {
      // overallHeight 구하기
      // B만 구하면 됨

      const lastElementInVElement = vDOM.vElements.findLast(
        (element) => element
      );

      if (lastElementInVElement) {
        setOverallHeightPx(lastElementInVElement.yPositionPx);
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
      const rows = getDividedElementsByColumn(dataInViewPort, column);

      setRenderingRows(rows);
      setBlankHeightPx({
        top: firstElementInViewPort.yPositionPx,
        bottom: overallHeightPx - lastElementInViewPort.yPositionPx,
      });
    }
  }, [dataInViewPort]);

  useEffect(() => {
    if (newData) {
      const rows = getDividedElementsByColumn(newData, column);

      setRenderingRows(rows);
    }
  }, [newData]);

  return (
    <RootDiv className={className}>
      <Blank blankHeightPx={blankHeightPx.top} />
      {renderingRows &&
        renderingRows.map((row, rowIndex) => {
          return (
            row.length !== 0 && (
              <Row>
                {row.map(
                  (element, colIndex) =>
                    element && (
                      <Element
                        vDOM={vDOM}
                        vDOMKey={column * rowIndex + colIndex}
                      >
                        {element}
                      </Element>
                    )
                )}
              </Row>
            )
          );
        })}
      <Blank blankHeightPx={blankHeightPx.bottom} />

      <NewDataFetching getNewData={getNewData} vDOM={vDOM} />
    </RootDiv>
  );
};

export default InfiniteScroll;
