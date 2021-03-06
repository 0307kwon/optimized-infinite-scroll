import {
  getDividedElementsByColumn,
  isSameArray,
} from "optimized-infinite-scroll/util/common";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import useDebounce from "../useDebounce";
import useScrollOffset from "./useScrollOffset";

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
  rootContainerRef: React.RefObject<HTMLDivElement>;
  column: number;
}

export interface VDOMInterface {
  vElements: VirtualElement[];
  vElementsInViewPort: (VirtualElement | null)[];
  registerVirtualElement: SetVDOM;
}

const useVDOM = ({ column, rootContainerRef }: Params): VDOMInterface => {
  const scrollOffsetRef = useScrollOffset({ rootContainerRef });
  const { setDebounceCallback } = useDebounce({ delay: 200 });

  const vElementsRef = useRef<VirtualElement[]>([]);

  const vElementsRowsRef = useRef<Row[]>([]);

  const vElementsInViewPortRef = useRef<(VirtualElement | null)[]>([]);
  const [vElementsInViewPort, setVElementsInViewPort] = useState<
    (VirtualElement | null)[]
  >([]);

  const isRowInViewPort = (row: Row) => {
    const scrollY =
      window.scrollY - scrollOffsetRef.current > 0
        ? window.scrollY - scrollOffsetRef.current
        : 0;

    const isTopInViewPort =
      row.yPositionPx > scrollY &&
      row.yPositionPx < scrollY + window.innerHeight;

    const isBottomInViewPort =
      row.yPositionPx + row.HeightPx > scrollY &&
      row.yPositionPx + row.HeightPx < scrollY + window.innerHeight;

    return isTopInViewPort || isBottomInViewPort;
  };

  const getVElementsInViewPort = () => {
    const rows = getDividedElementsByColumn(vElementsRef.current, column);

    vElementsRowsRef.current = rows.map((elements) => ({
      virtualElements: elements,
      yPositionPx: elements[0].yPositionPx,
      HeightPx: Math.max(...elements.map((element) => element.heightPx)),
    }));

    const vElementsInViewPort = new Array(vElementsRef.current.length).fill(
      null
    );

    const elementsInViewPort = vElementsRowsRef.current
      .filter((rows) => isRowInViewPort(rows))
      .map((row) => row.virtualElements)
      .flat();

    elementsInViewPort.forEach((element) => {
      vElementsInViewPort[element.id] = element;
    });

    return vElementsInViewPort;
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setDebounceCallback(() => {
        const afterVElementsInViewPort = getVElementsInViewPort();

        if (
          isSameArray(vElementsInViewPortRef.current, afterVElementsInViewPort)
        ) {
          return;
        }

        vElementsInViewPortRef.current = afterVElementsInViewPort;

        setVElementsInViewPort(vElementsInViewPortRef.current);
      });
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

export default useVDOM;
