"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Mic, Pause, Play, Radio, ShieldAlert, Trophy } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { CameraPanel } from "@/components/camera-panel";
import { ReportDialog } from "@/components/report-dialog";
import { StatCard } from "@/components/stat-card";
import { UsernameDialog } from "@/components/username-dialog";
import { DEFAULT_MATCH_SECONDS } from "@/lib/constants";
import { useLiveScore } from "@/hooks/use-live-score";
import { useArenaStore } from "@/store/use-arena-store";
import { useUserStore } from "@/store/use-user-store";

export default function ArenaPage() {
  const username = useUserStore((state) => state.username);
  const queueState = useArenaStore((state) => state.queueState);
  const setQueueState = useArenaStore((state) => state.setQueueState);
  const cameraEnabled = useArenaStore((state) => state.cameraEnabled);
  const micEnabled = useArenaStore((state) => state.micEnabled);
  const setCameraEnabled = useArenaStore((state) => state.setCameraEnabled);
  const setMicEnabled = useArenaStore((state) => state.setMicEnabled);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MATCH_SECONDS);
  const inMatch = queueState === "in_match";
  const playerScore = useLiveScore(inMatch);
  const opponentScore = useLiveScore(inMatch);

  useEffect(() => {
    if (queueState !== "in_match") return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          setQueueState("finished");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [queueState, setQueueState]);

  const winner = useMemo(() => {
    if (queueState !== "finished") return "";
    if (playerScore.average === opponentScore.average) return "Draw";
    return playerScore.average > opponentScore.average ? username || "Player" : "Opponent";
  }, [opponentScore.average, playerScore.average, queueState, username]);

  function startQueue() {
    setSecondsLeft(DEFAULT_MATCH_SECONDS);
    playerScore.reset();
    opponentScore.reset();
    setQueueState("searching");
    window.setTimeout(() => setQueueState("matched"), 900);
    window.setTimeout(() => setQueueState("in_match"), 1700);
  }

  function resetMatch() {
    setQueueState("idle");
    setSecondsLeft(DEFAULT_MATCH_SECONDS);
    playerScore.reset();
    opponentScore.reset();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <UsernameDialog open={!username} />

      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="panel-title">Arena</p>
          <h1 className="mt-1 text-4xl font-black">Live Battle</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            icon={<Camera size={17} />}
            onClick={() => setCameraEnabled(!cameraEnabled)}
            variant={cameraEnabled ? "secondary" : "danger"}
          >
            Kamera
          </ActionButton>
          <ActionButton
            icon={<Mic size={17} />}
            onClick={() => setMicEnabled(!micEnabled)}
            variant={micEnabled ? "secondary" : "danger"}
          >
            Voice
          </ActionButton>
          {queueState === "idle" || queueState === "finished" ? (
            <ActionButton variant="primary" icon={<Play size={17} />} onClick={startQueue} disabled={!username}>
              Matchmaking
            </ActionButton>
          ) : (
            <ActionButton icon={<Pause size={17} />} variant="danger" onClick={resetMatch}>
              Abbruch
            </ActionButton>
          )}
        </div>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Timer" value={`00:${secondsLeft.toString().padStart(2, "0")}`} icon={<Radio size={20} />} />
        <StatCard label="Dein Schnitt" value={playerScore.average || "--"} icon={<Trophy size={20} />} tone="mint" />
        <StatCard label="Gegner" value={opponentScore.average || "--"} icon={<ShieldAlert size={20} />} tone="pink" />
        <StatCard label="Status" value={queueState.replace("_", " ")} icon={<Radio size={20} />} tone="amber" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <CameraPanel title={username || "Player"} frame={playerScore.current} enabled={cameraEnabled} />
        <CameraPanel title="Opponent" frame={opponentScore.current} enabled opponent />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="glass-panel rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="panel-title">Match Control</p>
              <h2 className="mt-1 text-2xl font-black">
                {queueState === "searching"
                  ? "Suche realen Gegner"
                  : queueState === "matched"
                    ? "Gegner gefunden"
                    : queueState === "finished"
                      ? `Winner: ${winner}`
                      : "Bereit"}
              </h2>
            </div>
            <ReportDialog matchId="match_live_1042" reportedUser="Opponent" />
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-cyanx via-mintx to-pinkx"
              animate={{ width: `${((DEFAULT_MATCH_SECONDS - secondsLeft) / DEFAULT_MATCH_SECONDS) * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-panel rounded-lg p-5">
          <p className="panel-title">Safety</p>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-white/70">
            <p>Keine Nacktheit. Keine Attraktivitaetswertung. Nur Definition, Symmetrie, Sichtbarkeit und Konsistenz.</p>
            <p>Bei geringer Confidence wird der Score automatisch auf 0 gesetzt.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
