"use client";

import { useEffect, useRef, useState } from "react";
import { mediaConstraints } from "@/lib/webrtc";

export function useCamera(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function start() {
      if (!enabled) return;
      try {
        const nextStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        if (!mounted) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }
        setStream(nextStream);
        setError("");
        if (videoRef.current) videoRef.current.srcObject = nextStream;
      } catch {
        if (mounted) setError("Kamera nicht verfuegbar");
      }
    }

    start();

    return () => {
      mounted = false;
      setStream((current) => {
        current?.getTracks().forEach((track) => track.stop());
        return null;
      });
    };
  }, [enabled]);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return { videoRef, stream, error };
}
