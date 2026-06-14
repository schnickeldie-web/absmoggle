import { NextResponse } from "next/server";
import { validateUsername } from "@/lib/username";

const reservedUsernames = new Set(["admin", "support", "moderator"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") ?? "";
  const result = validateUsername(username);

  if (!result.valid) {
    return NextResponse.json({ available: false, message: result.message }, { status: 400 });
  }

  if (reservedUsernames.has(result.normalized.toLowerCase())) {
    return NextResponse.json({ available: false, message: "Username ist reserviert." });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ available: true, message: "Username verfuegbar." });
  }

  const { prisma } = await import("@/lib/prisma");
  const existing = await prisma.user.findUnique({
    where: { username: result.normalized },
    select: { id: true }
  });

  return NextResponse.json({
    available: !existing,
    message: existing ? "Username ist bereits vergeben." : "Username verfuegbar."
  });
}
