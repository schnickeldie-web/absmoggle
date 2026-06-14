"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  defaultAdminSettings,
  demoReports,
  demoUsers,
  initialAnnouncement
} from "@/lib/mock-data";
import type { AdminSettings, AdminUser, ModerationReport } from "@/lib/types";

type BanPayload = {
  userId: string;
  reason: string;
  type: "Permanent" | "Temporaer" | "IP";
};

type AdminState = {
  announcement: string;
  users: AdminUser[];
  reports: ModerationReport[];
  settings: AdminSettings;
  setAnnouncement: (announcement: string) => void;
  updateSettings: (settings: Partial<AdminSettings>) => void;
  banUser: (payload: BanPayload) => void;
  unbanUser: (userId: string) => void;
  resetRanking: (userId: string) => void;
  markWebcamViolation: (userId: string) => void;
  addUserNote: (userId: string, note: string) => void;
  promoteToAdmin: (username: string) => void;
  resolveReport: (reportId: string) => void;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      announcement: initialAnnouncement,
      users: demoUsers,
      reports: demoReports,
      settings: defaultAdminSettings,
      setAnnouncement: (announcement) => set({ announcement }),
      updateSettings: (settings) => set({ settings: { ...get().settings, ...settings } }),
      banUser: ({ userId, reason, type }) =>
        set({
          users: get().users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  status: "BANNED",
                  notes: [user.notes, `${type} Ban: ${reason}`].filter(Boolean).join("\n")
                }
              : user
          )
        }),
      unbanUser: (userId) =>
        set({
          users: get().users.map((user) =>
            user.id === userId ? { ...user, status: "OFFLINE" } : user
          )
        }),
      resetRanking: (userId) =>
        set({
          users: get().users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  currentStreak: 0,
                  bestStreak: 0,
                  averageScore: 0,
                  totalWins: 0,
                  totalMatches: 0,
                  matchHistory: []
                }
              : user
          )
        }),
      markWebcamViolation: (userId) =>
        set({
          users: get().users.map((user) =>
            user.id === userId
              ? { ...user, webcamViolations: user.webcamViolations + 1 }
              : user
          )
        }),
      addUserNote: (userId, note) =>
        set({
          users: get().users.map((user) =>
            user.id === userId
              ? { ...user, notes: [user.notes, note].filter(Boolean).join("\n") }
              : user
          )
        }),
      promoteToAdmin: (username) =>
        set({
          users: get().users.map((user) =>
            user.username.toLowerCase() === username.toLowerCase()
              ? { ...user, role: "ADMIN" }
              : user
          )
        }),
      resolveReport: (reportId) =>
        set({
          reports: get().reports.map((report) =>
            report.id === reportId ? { ...report, status: "RESOLVED" } : report
          )
        })
    }),
    {
      name: "absmoggle-admin",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
