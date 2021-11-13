import {
  getDividedElementsByColumn,
  isSameArray,
} from "optimized-infinite-scroll/util/common";
import React, { ReactNode, useEffect, useRef, useState } from "react";

interface VirtualElement {
  element: ReactNode;
  heightPx: number;
  yPositionPx: number;
}

type SetVDOM = (elementIndex: number, virtualElement: VirtualElement) => void;

export interface VDOMInterface {
  registerVirtualElement: SetVDOM;
}

interface Row {
  yPositionPx: number;
  HeightPx: number;
  elements: VirtualElement[];
}

interface Params {
  column: number;
}

const useVDOM = ({ column }: Params): VDOMInterface => {
  const cachedAllElements = useRef<VirtualElement[]>([]);
  const cachedAllElementsRows = useRef<Row[]>([]);
  const VDOMRef = useRef<VirtualElement[]>([]);
  const [VDOM, setVDOM] = useState<VirtualElement[]>([]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const rows = getDividedElementsByColumn(
        cachedAllElements.current,
        column
      );

      cachedAllElementsRows.current = rows.map((elements) => ({
        elements,
        yPositionPx: elements[0].yPositionPx,
        HeightPx: Math.max(...elements.map((element) => element.heightPx)),
      }));

      const afterVDOM = cachedAllElementsRows.current
        .filter((rows) => isRowInViewPort(rows))
        .map((row) => row.elements)
        .flat();

      if (isSameArray(VDOMRef.current, afterVDOM)) {
        return;
      }

      VDOMRef.current = afterVDOM;
      setVDOM(VDOMRef.current);
    });
  }, []);

  return {
    registerVirtualElement: (vDOMKey, virtualElement) => {
      cachedAllElements.current[vDOMKey] = virtualElement;
    },
  };
};

const isRowInViewPort = (row: Row) => {
  const isBottomInViewPort =
    row.yPositionPx + row.HeightPx > window.scrollY &&
    row.yPositionPx + row.HeightPx < window.scrollY + window.innerHeight;

  const isTopInViewPort =
    row.yPositionPx > window.scrollY &&
    row.yPositionPx < window.scrollY + window.innerHeight;

  return isBottomInViewPort || isTopInViewPort;
};

export default useVDOM;
