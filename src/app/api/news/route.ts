import { NextRequest, NextResponse } from "next/server";
import { getNewsItems } from "@/lib/news";

export async function GET(request: NextRequest) {
  const days = Number(request.nextUrl.searchParams.get("days") ?? 30);
  const safeDays = Number.isFinite(days) ? Math.min(Math.max(days, 1), 30) : 30;
  const news = await getNewsItems(safeDays);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    days: safeDays,
    news
  });
}
