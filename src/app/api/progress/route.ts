import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getUserProgress, saveProgress } from "@/lib/progress";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ progress: [] });
    }

    const progress = await getUserProgress(session.userId);
    return NextResponse.json({ progress });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    const payload = await request.json();
    const progress = await saveProgress(payload, session?.userId);
    return NextResponse.json({ progress });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid progress payload", issues: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
