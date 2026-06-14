"use client";

import { useEffect, useMemo, useState } from "react";
import { averageScore, createSimulatedFrame } from "@/lib/scoring";
import type { ScoreFrame } from "@/lib/types";

export function useLiveScore(active = true) {
  const [frames, setFrames] = useState<ScoreFrame[]>([]);

  useEffect(() => {
    if (!active) return;
    const addFrame = () => setFrames((current) => [...current.slice(-29), createSimulatedFrame()]);
    addFrame();
    const timer = window.setInterval(addFrame, 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  const current = frames.at(-1);
  const average = useMemo(() => averageScore(frames), [frames]);

  return {
    frames,
    current,
    average,
    reset: () => setFrames([])
  };
}
