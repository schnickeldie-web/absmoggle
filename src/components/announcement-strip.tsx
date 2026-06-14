"use client";

import { Megaphone } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";

export function AnnouncementStrip() {
  const announcement = useAdminStore((state) => state.announcement);

  return (
    <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="glass-panel flex items-center gap-3 rounded-lg px-4 py-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-md border border-amberx/45 bg-amberx/12 text-amberx">
          <Megaphone size={18} />
        </div>
        <p className="text-sm font-bold text-white/82">{announcement}</p>
      </div>
    </div>
  );
}
