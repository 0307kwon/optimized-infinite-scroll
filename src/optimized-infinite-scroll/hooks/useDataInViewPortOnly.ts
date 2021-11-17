import { VDOMInterface } from "optimized-infinite-scroll/hooks/useVDOM";
import React, { useEffect, useState } from "react";

interface Params {
  vDOM: VDOMInterface;
}

const useDataInViewPortOnly = ({ vDOM }: Params) => {
  const [dataInViewPort, setDataInViewPort] = useState<
    React.ReactNode[] | null
  >(null);

  useEffect(() => {
    if (vDOM.vElementsInViewPort.length === 0) {
      return;
    }

    const elements = vDOM.vElementsInViewPort.map(
      (virtualElement) => virtualElement?.actualReactNode
    );

    setDataInViewPort(elements);
  }, [vDOM.vElementsInViewPort]);

  return {
    dataInViewPort,
  };
};

export default useDataInViewPortOnly;
