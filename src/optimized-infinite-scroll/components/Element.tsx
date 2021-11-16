import { VDOMInterface } from "optimized-infinite-scroll/hooks/useVDOM";
import React, { ReactNode, useEffect, useRef } from "react";

interface Props {
  vDOM: VDOMInterface;
  vDOMKey: number;
  children: ReactNode;
}

const Element = ({ vDOM, vDOMKey, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref?.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();

    vDOM.registerVirtualElement(vDOMKey, {
      id: vDOMKey,
      actualReactNode: children,
      heightPx: rect.height,
      yPositionPx: ref.current.offsetTop,
    });
  }, [ref]);

  return <div ref={ref}>{children}</div>;
};

export default Element;
