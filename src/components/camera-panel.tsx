"use client";

import { Camera, CameraOff } from "lucide-react";
import { ScannerOverlay } from "@/components/scanner-overlay";
import { useCamera } from "@/hooks/use-camera";
import type { ScoreFrame } from "@/lib/types";

type CameraPanelProps = {
  title: string;
  frame?: ScoreFrame;
  enabled?: boolean;
  opponent?: boolean;
};

export function CameraPanel({ title, frame, enabled = true, opponent = false }: CameraPanelProps) {
  const { videoRef, error } = useCamera(enabled && !opponent);

  return (
    <section className="glass-panel relative min-h-[420px] overflow-hidden rounded-lg">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-md border border-white/12 bg-black/45 px-3 py-2 backdrop-blur-md">
        {enabled ? <Camera size={16} className="text-cyanx" /> : <CameraOff size={16} className="text-dangerx" />}
        <span className="text-sm font-black">{title}</span>
      </div>

      {opponent ? (
        <div className="absolute inset-0 bg-[url('/opponent-silhouette.png')] bg-cover bg-center opacity-90" />
      ) : error ? (
        <div className="absolute inset-0 grid place-items-center bg-black/50 p-6 text-center">
          <div>
            <CameraOff className="mx-auto text-dangerx" size={42} />
            <p className="mt-3 text-lg font-black">{error}</p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-night/30" />
      <ScannerOverlay frame={frame} />
    </section>
  );
}
