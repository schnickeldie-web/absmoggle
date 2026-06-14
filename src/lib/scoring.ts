import { CONFIDENCE_THRESHOLD, SCORE_WEIGHTS } from "@/lib/constants";
import type { ScanMetrics, ScoreFrame } from "@/lib/types";

function clamp(value: number, min = 0, max = 10) {
  return Math.min(max, Math.max(min, value));
}

export function calculateFinalScore(metrics: ScanMetrics) {
  if (metrics.confidence < CONFIDENCE_THRESHOLD) return 0;

  const score =
    metrics.definition * SCORE_WEIGHTS.definition +
    metrics.symmetry * SCORE_WEIGHTS.symmetry +
    metrics.visibility * SCORE_WEIGHTS.visibility +
    metrics.consistency * SCORE_WEIGHTS.consistency;

  return Number(clamp(score, 1, 10).toFixed(1));
}

export function averageScore(frames: ScoreFrame[]) {
  if (frames.length === 0) return 0;
  const total = frames.reduce((sum, frame) => sum + frame.score, 0);
  return Number((total / frames.length).toFixed(1));
}

export function createSimulatedFrame(seed = Date.now()): ScoreFrame {
  const wave = (Math.sin(seed / 900) + 1) / 2;
  const pulse = (Math.cos(seed / 1300) + 1) / 2;

  const metrics: ScanMetrics = {
    definition: clamp(5.4 + wave * 2.8 + Math.random() * 0.6),
    symmetry: clamp(5.8 + pulse * 2.1 + Math.random() * 0.5),
    visibility: clamp(6.2 + wave * 2 + Math.random() * 0.4),
    consistency: clamp(6.4 + pulse * 1.8 + Math.random() * 0.4),
    confidence: Number(clamp(0.72 + wave * 0.2 + Math.random() * 0.04, 0, 1).toFixed(2))
  };

  return {
    ...metrics,
    score: calculateFinalScore(metrics),
    timestamp: Date.now()
  };
}

export async function createBrowserVisionPipeline() {
  const mediaPipePackage = "@mediapipe/tasks-vision";
  const tfjsPackage = "@tensorflow/tfjs";
  const [{ FilesetResolver, PoseLandmarker }, tf] = await Promise.all([
    import(/* webpackIgnore: true */ mediaPipePackage),
    import(/* webpackIgnore: true */ tfjsPackage)
  ]);

  await tf.ready();

  return {
    FilesetResolver,
    PoseLandmarker,
    tensorflowBackend: tf.getBackend()
  };
}
