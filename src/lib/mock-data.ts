import type {
  AdminSettings,
  AdminUser,
  LeaderboardUser,
  ModerationReport
} from "@/lib/types";

export const initialAnnouncement =
  "Season Zero ist live: faire Scans, klare Moderation und ein sauberer Ranking-Start.";

export const verifiedLeaderboard: LeaderboardUser[] = [];

export const demoUsers: AdminUser[] = [
  {
    id: "usr_owner",
    username: "Benjamin",
    avatar: "BE",
    currentStreak: 0,
    bestStreak: 0,
    averageScore: 0,
    totalWins: 0,
    totalMatches: 0,
    role: "OWNER",
    status: "ONLINE",
    ipAddress: "127.0.0.1",
    notes: "Initialer Owner aus NEXT_PUBLIC_INITIAL_ADMIN_USERNAME.",
    webcamViolations: 0,
    createdAt: "2026-06-14T19:30:00.000Z",
    lastSeenAt: "2026-06-14T20:35:00.000Z",
    matchHistory: []
  },
  {
    id: "usr_pending",
    username: "new_player",
    avatar: "NE",
    currentStreak: 0,
    bestStreak: 0,
    averageScore: 0,
    totalWins: 0,
    totalMatches: 0,
    role: "USER",
    status: "OFFLINE",
    ipAddress: "10.0.0.24",
    notes: "",
    webcamViolations: 0,
    createdAt: "2026-06-14T18:12:00.000Z",
    lastSeenAt: "2026-06-14T20:20:00.000Z",
    matchHistory: []
  }
];

export const demoReports: ModerationReport[] = [
  {
    id: "rpt_001",
    category: "Fake Kamera",
    screenshotUrl: "/report-placeholder.png",
    matchId: "match_live_1042",
    reporter: "new_player",
    reportedUser: "unknown_user",
    createdAt: "2026-06-14T20:31:00.000Z",
    status: "OPEN"
  }
];

export const defaultAdminSettings: AdminSettings = {
  matchTimer: 30,
  maxMatchDuration: 90,
  rankingFormula: "currentStreak, bestStreak, averageScore, totalWins",
  turnServerUrl: "",
  turnUsername: "",
  webRtcPolicy: "all",
  maintenanceMode: false,
  registrationEnabled: true
};

export const liveActivity = [
  "Queue bereit",
  "Scanner kalibriert",
  "Admin audit aktiv",
  "Reportsync bereit"
];
