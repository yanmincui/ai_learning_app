import { describe, expect, it } from "vitest";
import { progressSchema, saveProgress } from "@/lib/progress";

describe("progressSchema", () => {
  it("accepts valid progress", () => {
    expect(
      progressSchema.parse({
        userId: "guest-123456",
        day: 1,
        status: "done",
        quizScore: 100,
        wrongQuestionIds: ["day-1-choice-1"]
      })
    ).toMatchObject({ day: 1, status: "done" });
  });

  it("rejects invalid course day", () => {
    expect(() =>
      progressSchema.parse({
        userId: "guest-123456",
        day: 31,
        status: "done"
      })
    ).toThrow();
  });

  it("prefers authenticated user id when saving progress", async () => {
    const progress = await saveProgress(
      {
        userId: "guest-123456",
        day: 2,
        status: "done",
        quizScore: 80,
        wrongQuestionIds: []
      },
      "wx-openid-123"
    );

    expect(progress.userId).toBe("wx-openid-123");
  });
});
