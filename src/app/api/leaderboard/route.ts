import { NextResponse } from "next/server";
import { verifiedLeaderboard } from "@/lib/mock-data";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ leaderboard: verifiedLeaderboard });
  }

  const { prisma } = await import("@/lib/prisma");
  const users = await prisma.user.findMany({
    where: {
      role: { not: "ADMIN" },
      status: "ACTIVE",
      wins: { gt: 0 }
    },
    orderBy: [
      { currentStreak: "desc" },
      { bestStreak: "desc" },
      { avgScore: "desc" },
      { wins: "desc" }
    ],
    take: 100,
    select: {
      id: true,
      username: true,
      currentStreak: true,
      bestStreak: true,
      avgScore: true,
      wins: true,
      losses: true
    }
  });

  return NextResponse.json({ leaderboard: users });
}
