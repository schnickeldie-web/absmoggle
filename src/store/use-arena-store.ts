"use client";

import { create } from "zustand";

type ArenaState = {
  cameraEnabled: boolean;
  micEnabled: boolean;
  queueState: "idle" | "searching" | "matched" | "in_match" | "finished";
  setCameraEnabled: (enabled: boolean) => void;
  setMicEnabled: (enabled: boolean) => void;
  setQueueState: (state: ArenaState["queueState"]) => void;
};

export const useArenaStore = create<ArenaState>((set) => ({
  cameraEnabled: true,
  micEnabled: true,
  queueState: "idle",
  setCameraEnabled: (cameraEnabled) => set({ cameraEnabled }),
  setMicEnabled: (micEnabled) => set({ micEnabled }),
  setQueueState: (queueState) => set({ queueState })
}));
