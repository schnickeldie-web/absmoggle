"use client";

import { LogOut, UserRound } from "lucide-react";
import { useUserStore } from "@/store/use-user-store";
import { ActionButton } from "@/components/action-button";
import { makeAvatarLabel } from "@/lib/username";

export function UserMenu() {
  const username = useUserStore((state) => state.username);
  const clearUsername = useUserStore((state) => state.clearUsername);

  if (!username) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 rounded-md border border-white/12 bg-white/8 px-3 py-2 sm:flex">
        <div className="grid size-8 place-items-center rounded-md bg-cyanx text-xs font-black text-night">
          {makeAvatarLabel(username)}
        </div>
        <span className="max-w-32 truncate text-sm font-bold">{username}</span>
      </div>
      <ActionButton
        aria-label="Benutzer abmelden"
        title="Benutzer abmelden"
        icon={<LogOut size={17} />}
        variant="ghost"
        className="size-11 px-0"
        onClick={clearUsername}
      />
      <UserRound className="sr-only" size={1} />
    </div>
  );
}
