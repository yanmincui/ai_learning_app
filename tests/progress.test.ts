import { describe, expect, it } from "vitest";
import { progressSchema } from "@/lib/progress";

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
});
