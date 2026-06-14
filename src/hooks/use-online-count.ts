"use client";

import { useEffect, useState } from "react";

export function useOnlineCount(base = 128) {
  const [count, setCount] = useState(base);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCount((value) => Math.max(1, value + Math.round(Math.random() * 8 - 3)));
    }, 1800);

    return () => window.clearInterval(timer);
  }, []);

  return count;
}
