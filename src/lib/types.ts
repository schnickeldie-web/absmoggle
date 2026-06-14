import type { REPORT_CATEGORIES } from "@/lib/constants";

export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

export type ScanMetrics = {
  definition: number;
  symmetry: number;
  visibility: number;
  consistency: number;
  confidence: number;
};

export type ScoreFrame = ScanMetrics & {
  score: number;
  timestamp: number;
};

export type LeaderboardUser = {
  id: string;
  username: string;
  avatar: string;
  currentStreak: number;
  bestStreak: number;
  averageScore: number;
  totalWins: number;
  totalMatches: number;
  isBot?: boolean;
};

export type MatchHistoryItem = {
  id: string;
  opponent: string;
  score: number;
  opponentScore: number;
  result: "Win" | "Loss";
  createdAt: string;
};

export type AdminUser = LeaderboardUser & {
  role: "OWNER" | "ADMIN" | "USER";
  status: "ONLINE" | "OFFLINE" | "BANNED";
  ipAddress: string;
  notes: string;
  webcamViolations: number;
  createdAt: string;
  lastSeenAt: string;
  matchHistory: MatchHistoryItem[];
};

export type ModerationReport = {
  id: string;
  category: ReportCategory;
  screenshotUrl: string;
  matchId: string;
  reporter: string;
  reportedUser: string;
  createdAt: string;
  status: "OPEN" | "REVIEWING" | "RESOLVED";
};

export type AdminSettings = {
  matchTimer: number;
  maxMatchDuration: number;
  rankingFormula: string;
  turnServerUrl: string;
  turnUsername: string;
  webRtcPolicy: "relay" | "all";
  maintenanceMode: boolean;
  registrationEnabled: boolean;
};
