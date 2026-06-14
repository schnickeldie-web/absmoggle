"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Crosshair, Radio, ShieldCheck, Trophy, Users } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { AnnouncementStrip } from "@/components/announcement-strip";
import { StatCard } from "@/components/stat-card";
import { useOnlineCount } from "@/hooks/use-online-count";
import { liveActivity, verifiedLeaderboard } from "@/lib/mock-data";

export default function HomePage() {
  const onlineCount = useOnlineCount(142);

  return (
    <main>
      <AnnouncementStrip />
      <section className="relative min-h-[calc(100vh-6rem)] overflow-hidden">
        <div className="absolute inset-0 fine-grid opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-night/16 to-night" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-[64vh] flex-col justify-center"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-cyanx/40 bg-cyanx/10 px-3 py-2 text-xs font-black uppercase text-cyanx shadow-neon">
              <span className="activity-dot size-2 rounded-full bg-mintx" />
              {onlineCount} online
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-7xl lg:text-8xl">
              ABSMOGGLE
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-white/72">
              Live 1v1 Fitness Battles mit privacy-first Scanner, klarer Moderation und Ranking nur aus verifizierten Matches.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/arena">
                <ActionButton variant="primary" icon={<ArrowRight size={18} />}>
                  Enter Arena
                </ActionButton>
              </Link>
              <Link href="/solo">
                <ActionButton icon={<Crosshair size={18} />}>Solo Scan</ActionButton>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid content-center gap-4"
          >
            <div className="glass-panel relative min-h-[520px] overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-[url('/scanner-panel.png')] bg-cover bg-center opacity-90" />
              <div className="absolute inset-0 scan-grid opacity-35" />
              <div className="absolute left-1/2 top-1/2 h-[58%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-cyanx/55 shadow-neon" />
              <div className="animate-scanline absolute inset-x-8 top-1/2 h-1 rounded-full bg-cyanx shadow-[0_0_30px_rgba(0,229,255,0.8)]" />
              <div className="absolute left-5 top-5 rounded-md border border-white/12 bg-black/45 p-4 backdrop-blur-md">
                <p className="panel-title">Live Confidence</p>
                <p className="mt-2 text-4xl font-black text-mintx">92%</p>
              </div>
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
                {["Definition", "Symmetry", "Visibility"].map((item, index) => (
                  <div key={item} className="rounded-md border border-white/12 bg-black/45 p-3 backdrop-blur-md">
                    <p className="text-[0.68rem] font-black uppercase text-white/55">{item}</p>
                    <p className={`mt-2 text-2xl font-black ${index === 1 ? "text-pinkx" : "text-cyanx"}`}>
                      {(8.4 - index * 0.3).toFixed(1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <StatCard label="Online Nutzer" value={onlineCount} icon={<Users size={20} />} tone="cyan" />
        <StatCard label="Matches heute" value="0" icon={<Activity size={20} />} tone="pink" />
        <StatCard label="Aktive Kameras" value="0" icon={<Radio size={20} />} tone="mint" />
        <StatCard label="Reports offen" value="1" icon={<ShieldCheck size={20} />} tone="amber" />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="glass-panel rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="panel-title">Leaderboard Preview</p>
              <h2 className="mt-1 text-3xl font-black">Verified Rankings</h2>
            </div>
            <Trophy className="text-amberx" size={26} />
          </div>
          <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
            {verifiedLeaderboard.length ? (
              verifiedLeaderboard.map((player, index) => (
                <div key={player.id} className="grid grid-cols-[48px_1fr_80px] border-b border-white/8 p-3 last:border-b-0">
                  <span className="font-black text-white/55">#{index + 1}</span>
                  <span className="font-bold">{player.username}</span>
                  <span className="text-right font-black text-cyanx">{player.currentStreak}</span>
                </div>
              ))
            ) : (
              <div className="grid min-h-36 place-items-center p-6 text-center">
                <p className="max-w-sm text-sm font-semibold text-white/62">
                  Noch keine verifizierten Matches. Das Ranking fuellt sich nur mit echten Matchdaten.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="glass-panel rounded-lg p-5">
          <p className="panel-title">Live Feed</p>
          <div className="mt-5 grid gap-3">
            {liveActivity.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/6 p-3">
                <span
                  className={`size-2 rounded-full ${
                    index % 2 === 0 ? "bg-cyanx shadow-neon" : "bg-pinkx shadow-pink"
                  }`}
                />
                <span className="text-sm font-bold text-white/76">{item}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
