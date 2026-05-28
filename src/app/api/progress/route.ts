import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { saveProgress } from "@/lib/progress";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const progress = await saveProgress(payload);
    return NextResponse.json({ progress });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid progress payload", issues: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
