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
    if (vDOM.virtualElements.length === 0) {
      return;
    }

    const elements = vDOM.virtualElements.map(
      (virtualElement) => virtualElement?.actualReactNode
    );

    setDataInViewPort(elements);
  }, [vDOM.virtualElements]);

  return {
    dataInViewPort,
  };
};

export default useDataInViewPortOnly;
