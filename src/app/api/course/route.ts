import { NextResponse } from "next/server";
import { courseDays, getTodayCourse } from "@/lib/course";

export function GET() {
  return NextResponse.json({
    today: getTodayCourse(),
    days: courseDays
  });
}
