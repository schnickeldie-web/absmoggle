"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity, Dumbbell, Gauge, Shield, Trophy } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { isAdminUser } from "@/lib/admin";
import { useUserStore } from "@/store/use-user-store";
import { ActionButton } from "@/components/action-button";
import { UserMenu } from "@/components/user-menu";
import { UsernameDialog } from "@/components/username-dialog";

const navItems = [
  { href: "/arena", label: "Arena", icon: Activity },
  { href: "/solo", label: "Solo", icon: Gauge },
  { href: "/leaderboard", label: "Ranking", icon: Trophy }
];

export function SiteHeader() {
  const [usernameOpen, setUsernameOpen] = useState(false);
  const username = useUserStore((state) => state.username);
  const extraAdmins = useUserStore((state) => state.extraAdmins);
  const canSeeAdmin = isAdminUser(username, extraAdmins);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-night/72 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md border border-cyanx/45 bg-cyanx/12 text-cyanx shadow-neon">
              <Dumbbell size={20} />
            </span>
            <span className="text-lg font-black tracking-normal neon-text">{APP_NAME}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-bold text-white/72 transition hover:bg-white/8 hover:text-white"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
            {canSeeAdmin ? (
              <Link
                href="/admin"
                className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-bold text-white/72 transition hover:bg-white/8 hover:text-white"
              >
                <Shield size={16} />
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            {username ? (
              <UserMenu />
            ) : (
              <ActionButton variant="primary" onClick={() => setUsernameOpen(true)}>
                Username
              </ActionButton>
            )}
          </div>
        </div>
      </header>
      <UsernameDialog open={usernameOpen} onClose={() => setUsernameOpen(false)} />
    </>
  );
}
