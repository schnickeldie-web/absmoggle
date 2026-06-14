"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getDefaultAdminUsernames } from "@/lib/admin";

type UserState = {
  username: string;
  extraAdmins: string[];
  setUsername: (username: string) => void;
  clearUsername: () => void;
  addAdmin: (username: string) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: "",
      extraAdmins: [],
      setUsername: (username) => set({ username }),
      clearUsername: () => set({ username: "" }),
      addAdmin: (username) => {
        const normalized = username.toLowerCase();
        const existing = new Set([...get().extraAdmins, ...getDefaultAdminUsernames()]);
        if (existing.has(normalized)) return;
        set({ extraAdmins: [...get().extraAdmins, normalized] });
      }
    }),
    {
      name: "absmoggle-user",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
