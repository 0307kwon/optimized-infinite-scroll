import { VDOMInterface } from "optimized-infinite-scroll/hooks/useVDOM";
import { getDividedElementsByColumn } from "optimized-infinite-scroll/util/common";
import React, { ReactNode, useEffect, useState } from "react";
import Element from "./Element";
import { Blank, Row } from "./ActualDOM.styles";

interface Props {
  children: ReactNode[];
  column: number;
  vDOM: VDOMInterface;
}

const ActualDOM = ({ children, column, vDOM }: Props) => {
  const [renderingRows, setRenderingRows] = useState<ReactNode[][] | null>(
    null
  );
  const [blankHeightPx, setBlankHeightPx] = useState(0);
  const [temp, setTemp] = useState([]);

  const mountAdditionalElements = (children: ReactNode[]) => {
    if (children.length === 0) {
      return;
    }

    const nextElementIndex = vDOM.virtualElements.length;
    const additionalChildren = children.slice(nextElementIndex);

    const actualElements = vDOM.virtualElements.map(
      (virtualElement) => virtualElement?.actualReactNode
    );

    const newRenderingElements = [...actualElements, ...additionalChildren];

    const rows = getDividedElementsByColumn(newRenderingElements, column);

    setRenderingRows(rows);
  };

  useEffect(() => {
    mountAdditionalElements(children);
  }, [children]);

  useEffect(() => {
    if (vDOM.virtualElements.length === 0) {
      return;
    }

    const elements = vDOM.virtualElements.map(
      (virtualElement) => virtualElement?.actualReactNode
    );

    const rows = getDividedElementsByColumn(elements, column);

    const firstElementInViewPort = vDOM.virtualElements.find(
      (element) => element
    );

    if (firstElementInViewPort) {
      setBlankHeightPx(firstElementInViewPort.yPositionPx);
      setRenderingRows(rows);
    }
  }, [vDOM.virtualElements]);

  return (
    <>
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
    </>
  );
};

export default ActualDOM;
