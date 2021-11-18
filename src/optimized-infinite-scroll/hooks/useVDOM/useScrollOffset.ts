import React, { useEffect, useRef, useState } from "react";

interface Param {
  rootContainerRef: React.RefObject<HTMLDivElement>;
}

const useScrollOffset = ({ rootContainerRef }: Param) => {
  const scrollOffsetRef = useRef(0);

  useEffect(() => {
    if (!rootContainerRef.current) {
      console.error("root container에 ref가 등록되지 않았습니다.");
      return;
    }

    const scrollOffset = Math.abs(
      window.scrollY - rootContainerRef.current?.getBoundingClientRect().top ||
        0
    );
    scrollOffsetRef.current = scrollOffset;
  }, []);

  return scrollOffsetRef;
};

export default useScrollOffset;
