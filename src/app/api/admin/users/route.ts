import { NextResponse } from "next/server";
import { demoUsers } from "@/lib/mock-data";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ users: demoUsers });
  }

  const { prisma } = await import("@/lib/prisma");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      username: true,
      role: true,
      status: true,
      ipAddress: true,
      notes: true,
      wins: true,
      losses: true,
      currentStreak: true,
      bestStreak: true,
      avgScore: true,
      webcamViolations: true,
      createdAt: true,
      lastSeenAt: true
    }
  });

  return NextResponse.json({ users });
}
