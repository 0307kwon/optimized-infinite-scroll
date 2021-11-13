import { VDOMInterface } from "optimized-infinite-scroll/hooks/useVDOM";
import { getDividedElementsByColumn } from "optimized-infinite-scroll/util/common";
import React, { ReactNode, useEffect, useState } from "react";
import Element from "./Element";
import { Row } from "./ActualDOM.styles";

interface Props {
  children: ReactNode[];
  column: number;
  vDOM: VDOMInterface;
}

const ActualDOM = ({ children, column, vDOM }: Props) => {
  const [renderingRows, setRenderingRows] = useState<ReactNode[][]>([]);

  useEffect(() => {
    const rows = getDividedElementsByColumn(children, column);

    setRenderingRows(rows);
  }, [children]);

  return (
    <>
      {renderingRows.map((row, rowIndex) => {
        return (
          <Row>
            {row.map(
              (element, colIndex) =>
                element && (
                  <Element vDOM={vDOM} vDOMKey={column * rowIndex + colIndex}>
                    {element}
                  </Element>
                )
            )}
          </Row>
        );
      })}
    </>
  );
};

export default ActualDOM;
