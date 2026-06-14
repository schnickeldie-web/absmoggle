import { Activity, Crosshair, Eye, ScanLine, ShieldCheck } from "lucide-react";
import type { ScoreFrame } from "@/lib/types";

type ScannerOverlayProps = {
  frame?: ScoreFrame;
  label?: string;
  compact?: boolean;
};

function value(value?: number, digits = 1) {
  return typeof value === "number" ? value.toFixed(digits) : "--";
}

export function ScannerOverlay({ frame, label = "AB Scan", compact = false }: ScannerOverlayProps) {
  const score = value(frame?.score);
  const confidence = typeof frame?.confidence === "number" ? `${Math.round(frame.confidence * 100)}%` : "--";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg border border-cyanx/25">
      <div className="absolute inset-0 scan-grid opacity-55" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyanx/20 to-transparent" />
      <div className="animate-scanline absolute inset-x-4 top-1/2 h-1 rounded-full bg-cyanx shadow-[0_0_28px_rgba(0,229,255,0.9)]" />

      <div className="animate-pulse-ring absolute left-1/2 top-[52%] h-[38%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-cyanx/70 shadow-neon">
        <div className="absolute left-[18%] top-[22%] h-[22%] w-[22%] rounded-sm border border-pinkx/55 bg-pinkx/12" />
        <div className="absolute right-[18%] top-[22%] h-[22%] w-[22%] rounded-sm border border-pinkx/55 bg-pinkx/12" />
        <div className="absolute left-[18%] bottom-[20%] h-[22%] w-[22%] rounded-sm border border-cyanx/60 bg-cyanx/12" />
        <div className="absolute right-[18%] bottom-[20%] h-[22%] w-[22%] rounded-sm border border-cyanx/60 bg-cyanx/12" />
        <Crosshair className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-cyanx/70" size={24} />
      </div>

      <div className="absolute left-3 top-3 rounded-md border border-white/12 bg-black/45 px-3 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-cyanx">
          <ScanLine size={14} />
          {label}
        </div>
        <div className="mt-1 text-2xl font-black text-white">{score}</div>
      </div>

      <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
        <div className="rounded-md border border-white/12 bg-black/45 p-2 backdrop-blur-md">
          <div className="flex items-center gap-1 text-[0.66rem] font-black uppercase text-white/58">
            <ShieldCheck size={12} />
            Conf
          </div>
          <div className="mt-1 text-sm font-black text-mintx">{confidence}</div>
        </div>
        <div className="rounded-md border border-white/12 bg-black/45 p-2 backdrop-blur-md">
          <div className="flex items-center gap-1 text-[0.66rem] font-black uppercase text-white/58">
            <Eye size={12} />
            Sicht
          </div>
          <div className="mt-1 text-sm font-black text-cyanx">{value(frame?.visibility)}</div>
        </div>
        <div className="rounded-md border border-white/12 bg-black/45 p-2 backdrop-blur-md">
          <div className="flex items-center gap-1 text-[0.66rem] font-black uppercase text-white/58">
            <Activity size={12} />
            Def
          </div>
          <div className="mt-1 text-sm font-black text-pinkx">{value(frame?.definition)}</div>
        </div>
      </div>

      {!compact ? (
        <div className="absolute right-3 top-3 flex flex-col gap-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-1 w-14 rounded-full bg-cyanx/70 shadow-neon"
              style={{ opacity: 1 - index * 0.12 }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
