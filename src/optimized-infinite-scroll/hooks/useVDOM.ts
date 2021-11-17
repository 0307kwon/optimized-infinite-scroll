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

interface Row {
  virtualElements: VirtualElement[];
  yPositionPx: number;
  HeightPx: number;
}

interface Params {
  column: number;
}

export interface VDOMInterface {
  vElements: VirtualElement[];
  vElementsInViewPort: (VirtualElement | null)[];
  registerVirtualElement: SetVDOM;
}

const useVDOM = ({ column }: Params): VDOMInterface => {
  const vElementsRef = useRef<VirtualElement[]>([]);
  const [vElements, setVElements] = useState<VirtualElement[]>([]);

  const vElementsRowsRef = useRef<Row[]>([]);

  const vElementsInViewPortRef = useRef<(VirtualElement | null)[]>([]);
  const [vElementsInViewPort, setVElementsInViewPort] = useState<
    (VirtualElement | null)[]
  >([]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const rows = getDividedElementsByColumn(vElementsRef.current, column);

      vElementsRowsRef.current = rows.map((elements) => ({
        virtualElements: elements,
        yPositionPx: elements[0].yPositionPx,
        HeightPx: Math.max(...elements.map((element) => element.heightPx)),
      }));

      const afterVDOM = new Array(vElementsRef.current.length).fill(null);

      const elementsInViewPort = vElementsRowsRef.current
        .filter((rows) => isRowInViewPort(rows))
        .map((row) => row.virtualElements)
        .flat();

      elementsInViewPort.forEach((element) => {
        afterVDOM[element.id] = element;
      });

      if (isSameArray(vElementsInViewPortRef.current, afterVDOM)) {
        return;
      }

      vElementsInViewPortRef.current = afterVDOM;

      setVElementsInViewPort(vElementsInViewPortRef.current);
    });
  }, []);

  return {
    vElements: vElementsRef.current,
    vElementsInViewPort,
    registerVirtualElement: (vDOMKey, virtualElement) => {
      if (vElementsRef.current[vDOMKey]) {
        return;
      }

      vElementsRef.current[vDOMKey] = virtualElement;
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
