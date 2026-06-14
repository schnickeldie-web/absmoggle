"use client";

import { useState } from "react";
import { Gauge, Play, RotateCcw, Trophy } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { CameraPanel } from "@/components/camera-panel";
import { StatCard } from "@/components/stat-card";
import { useLiveScore } from "@/hooks/use-live-score";
import { useUserStore } from "@/store/use-user-store";

export default function SoloPage() {
  const username = useUserStore((state) => state.username);
  const [active, setActive] = useState(false);
  const score = useLiveScore(active);

  function restart() {
    score.reset();
    setActive(true);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="panel-title">Solo Ranking</p>
          <h1 className="mt-1 text-4xl font-black">Private Scan</h1>
        </div>
        <div className="flex gap-2">
          <ActionButton variant="primary" icon={<Play size={17} />} onClick={restart}>
            Start
          </ActionButton>
          <ActionButton icon={<RotateCcw size={17} />} onClick={() => score.reset()}>
            Reset
          </ActionButton>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Live Score" value={score.current?.score ?? "--"} icon={<Gauge size={20} />} />
        <StatCard label="Privater Schnitt" value={score.average || "--"} icon={<Trophy size={20} />} tone="mint" />
        <StatCard label="Frames" value={score.frames.length} icon={<Gauge size={20} />} tone="pink" />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <CameraPanel title={username || "Solo Player"} frame={score.current} enabled />
        <aside className="glass-panel rounded-lg p-5">
          <p className="panel-title">Private Result</p>
          <h2 className="mt-2 text-3xl font-black">{score.average || "--"}</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-white/68">
            Dieser Wert wird nicht ins globale Ranking geschrieben und erzeugt keinen Win/Loss Eintrag.
          </p>
          <div className="mt-5 grid gap-3">
            {["Definition", "Symmetrie", "Sichtbarkeit", "Konsistenz"].map((label) => (
              <div key={label} className="flex items-center justify-between rounded-md border border-white/10 bg-white/6 p-3">
                <span className="text-sm font-bold text-white/64">{label}</span>
                <span className="font-black text-cyanx">live</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
