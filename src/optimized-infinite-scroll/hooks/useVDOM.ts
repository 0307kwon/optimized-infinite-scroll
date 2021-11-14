import {
  getDividedElementsByColumn,
  isSameArray,
} from "optimized-infinite-scroll/util/common";
import React, { ReactNode, useEffect, useRef, useState } from "react";

interface VirtualElement {
  id: number;
  actualReactNode: ReactNode;
  heightPx: number;
  yPositionPx: number;
}

type SetVDOM = (elementIndex: number, virtualElement: VirtualElement) => void;

export interface VDOMInterface {
  virtualElements: (VirtualElement | null)[];
  registerVirtualElement: SetVDOM;
}

interface Row {
  yPositionPx: number;
  HeightPx: number;
  virtualElements: VirtualElement[];
}

interface Params {
  column: number;
}

const useVDOM = ({ column }: Params): VDOMInterface => {
  const cachedAllElements = useRef<VirtualElement[]>([]);
  const cachedAllElementsRows = useRef<Row[]>([]);
  const vDOMRef = useRef<(VirtualElement | null)[]>([]);
  const [vDOM, setVDOM] = useState<(VirtualElement | null)[]>([]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const rows = getDividedElementsByColumn(
        cachedAllElements.current,
        column
      );

      cachedAllElementsRows.current = rows.map((elements) => ({
        virtualElements: elements,
        yPositionPx: elements[0].yPositionPx,
        HeightPx: Math.max(...elements.map((element) => element.heightPx)),
      }));

      const afterVDOM = new Array(cachedAllElements.current.length).fill(null);

      const elementsInViewPort = cachedAllElementsRows.current
        .filter((rows) => isRowInViewPort(rows))
        .map((row) => row.virtualElements)
        .flat();

      elementsInViewPort.forEach((element) => {
        afterVDOM[element.id] = element;
      });

      if (isSameArray(vDOMRef.current, afterVDOM)) {
        return;
      }

      vDOMRef.current = afterVDOM;

      setVDOM(vDOMRef.current);
    });
  }, []);

  return {
    virtualElements: vDOM,
    registerVirtualElement: (vDOMKey, virtualElement) => {
      if (cachedAllElements.current[vDOMKey]) {
        return;
      }

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
