import { VDOMInterface } from "optimized-infinite-scroll/hooks/useVDOM/useVDOM";
import React, { ReactNode, useEffect, useState } from "react";

interface Params {
  vDOM: VDOMInterface;
  children: ReactNode[];
  renderingElements: ReactNode[] | null;
}

const useNewData = ({ vDOM, children, renderingElements }: Params) => {
  const [newData, setNewData] = useState<ReactNode[] | null>(null);
  const [isNewDataMounting, setNewDataMounting] = useState(false);

  const getNewElementsOnly = (children: ReactNode[]) => {
    if (children.length === 0) {
      return [];
    }

    const nextElementIndex = vDOM.vElementsInViewPort.length;
    const additionalChildren = children.slice(nextElementIndex);

    const actualElements = vDOM.vElementsInViewPort.map(
      (virtualElement) => virtualElement?.actualReactNode
    );

    const newElements = [...actualElements, ...additionalChildren];

    return newElements;
  };

  useEffect(() => {
    setNewDataMounting(true);

    const newElements = getNewElementsOnly(children);

    setNewData(newElements);
  }, [children]);

  useEffect(() => {
    if (isNewDataMounting) {
      setNewDataMounting(false);
    }
  }, [isNewDataMounting, renderingElements]);

  return {
    newData,
    isNewDataMounting,
  };
};

export default useNewData;
