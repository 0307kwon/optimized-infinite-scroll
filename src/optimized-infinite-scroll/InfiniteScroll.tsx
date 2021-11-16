import React, { ReactNode, useEffect, useState } from "react";
import { GetNewData } from "types";
import Element from "./components/Element";
import NewDataFetching from "./components/NewDataFetching";
import useDataInViewPortOnly from "./hooks/useDataInViewPortOnly";
import useNewData from "./hooks/useNewData";
import useVDOM from "./hooks/useVDOM";
import { Blank, RootDiv, Row } from "./InfiniteScroll.styles";
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
  const vDOM = useVDOM({ column });
  const [renderingRows, setRenderingRows] = useState<ReactNode[][] | null>(
    null
  );
  const [blankHeightPx, setBlankHeightPx] = useState(0);
  const { newData } = useNewData({ vDOM, children, renderingRows });
  const { dataInViewPort } = useDataInViewPortOnly({ vDOM });

  useEffect(() => {
    if (!dataInViewPort) {
      return;
    }

    const firstElementInViewPort = vDOM.virtualElements.find(
      (element) => element
    );

    if (firstElementInViewPort) {
      const rows = getDividedElementsByColumn(dataInViewPort, column);

      setRenderingRows(rows);
      setBlankHeightPx(firstElementInViewPort.yPositionPx);
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
      <Blank blankHeightPx={blankHeightPx} />
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

      <NewDataFetching getNewData={getNewData} vDOM={vDOM} />
    </RootDiv>
  );
};

export default InfiniteScroll;
