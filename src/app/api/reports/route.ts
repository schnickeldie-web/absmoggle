import { NextResponse } from "next/server";
import { REPORT_CATEGORIES } from "@/lib/constants";
import { demoReports } from "@/lib/mock-data";
import type { ReportCategory } from "@/lib/types";

function isReportCategory(value: unknown): value is ReportCategory {
  return typeof value === "string" && REPORT_CATEGORIES.includes(value as ReportCategory);
}

export async function GET() {
  return NextResponse.json({ reports: demoReports });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    matchId?: string;
    reportedUser?: string;
    category?: unknown;
  };

  if (!body.matchId || !body.reportedUser || !isReportCategory(body.category)) {
    return NextResponse.json({ error: "Invalid report payload" }, { status: 400 });
  }

  return NextResponse.json({
    report: {
      id: `rpt_${Date.now()}`,
      category: body.category,
      screenshotUrl: "/report-placeholder.png",
      matchId: body.matchId,
      reporter: "current_user",
      reportedUser: body.reportedUser,
      createdAt: new Date().toISOString(),
      status: "OPEN"
    }
  });
}
