import { DependencyList, useEffect, useRef } from "react";

const useIntersectionObserver = (
  callback: () => void,
  dep: DependencyList = []
) => {
  const targetElementRef = useRef(null);
  const freshCallback = useRef(callback);

  useEffect(() => {
    freshCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!targetElementRef || !targetElementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            freshCallback.current();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(targetElementRef.current);

    return () => {
      observer.disconnect();
    };
  }, dep);

  return targetElementRef;
};

export default useIntersectionObserver;
