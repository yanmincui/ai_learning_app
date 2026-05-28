import { z } from "zod";
import { createSupabaseServerClient } from "./supabase";
import type { UserProgress } from "./types";

export const progressSchema = z.object({
  userId: z.string().min(6).max(128),
  day: z.number().int().min(1).max(30),
  status: z.enum(["todo", "doing", "done"]),
  quizScore: z.number().min(0).max(100).optional(),
  wrongQuestionIds: z.array(z.string()).optional()
});

export async function saveProgress(input: unknown): Promise<UserProgress> {
  const progress = progressSchema.parse(input);
  const payload = {
    user_id: progress.userId,
    day: progress.day,
    status: progress.status,
    quiz_score: progress.quizScore ?? null,
    wrong_question_ids: progress.wrongQuestionIds ?? [],
    last_reviewed_at: new Date().toISOString(),
    completed_at: progress.status === "done" ? new Date().toISOString() : null
  };

  const supabase = createSupabaseServerClient();

  if (supabase) {
    const { error } = await supabase.from("user_progress").upsert(payload, { onConflict: "user_id,day" });
    if (error) {
      throw new Error(error.message);
    }
  }

  return {
    userId: payload.user_id,
    day: payload.day,
    status: payload.status,
    quizScore: payload.quiz_score ?? undefined,
    wrongQuestionIds: payload.wrong_question_ids,
    lastReviewedAt: payload.last_reviewed_at,
    completedAt: payload.completed_at ?? undefined
  };
}
