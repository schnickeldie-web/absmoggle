export const APP_NAME = "ABSMOGGLE";

export const SCORE_WEIGHTS = {
  definition: 0.4,
  symmetry: 0.25,
  visibility: 0.25,
  consistency: 0.1
} as const;

export const MAX_BOTS = 3;
export const DEFAULT_MATCH_SECONDS = 30;
export const MAX_MATCH_SECONDS = 90;
export const CONFIDENCE_THRESHOLD = 0.6;

export const REPORT_CATEGORIES = [
  "Beleidigung",
  "Nacktheit",
  "Fake Kamera",
  "Spam",
  "Sonstiges"
] as const;

export const BAN_TYPES = ["Permanent", "Temporaer", "IP"] as const;
