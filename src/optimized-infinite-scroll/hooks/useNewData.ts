import { VDOMInterface } from "optimized-infinite-scroll/hooks/useVDOM";
import React, { ReactNode, useEffect, useState } from "react";

interface Params {
  vDOM: VDOMInterface;
  children: ReactNode[];
  renderingRows: React.ReactNode[][] | null;
}

const useNewData = ({ vDOM, children, renderingRows }: Params) => {
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
  }, [isNewDataMounting, renderingRows]);

  return {
    newData,
    isNewDataMounting,
  };
};

export default useNewData;
