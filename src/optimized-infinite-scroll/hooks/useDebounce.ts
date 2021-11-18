import React, { useEffect, useRef, useState } from "react";

interface Params {
  delay: number;
}

const useDebounce = ({ delay }: Params) => {
  const [callback, setCallback] = useState<(() => void) | null>(null);

  const setDebounceCallback = (debounceCallback: () => void) => {
    setCallback(() => debounceCallback);
  };

  useEffect(() => {
    if (!callback) {
      return;
    }

    const id = setTimeout(() => {
      callback?.();

      setCallback(null);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [callback]);

  return {
    setDebounceCallback,
  };
};

export default useDebounce;
