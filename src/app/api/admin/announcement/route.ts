import { NextResponse } from "next/server";
import { initialAnnouncement } from "@/lib/mock-data";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ message: initialAnnouncement });
  }

  const { prisma } = await import("@/lib/prisma");
  const announcement = await prisma.announcement.findFirst({
    where: { active: true },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({ message: announcement?.message ?? initialAnnouncement });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string };

  if (!body.message || body.message.trim().length < 3) {
    return NextResponse.json({ error: "Announcement too short" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ message: body.message.trim() });
  }

  const { prisma } = await import("@/lib/prisma");
  const announcement = await prisma.announcement.create({
    data: { message: body.message.trim(), active: true }
  });

  return NextResponse.json({ message: announcement.message });
}
