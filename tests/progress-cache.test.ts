import { describe, expect, it } from "vitest";
import {
  clearQuizDraft,
  mergeDayProgress,
  readLocalProgress,
  readQuizDraft,
  writeQuizDraft,
  writeLocalProgress
} from "@/lib/progress-cache";

function createStorage() {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    raw: store
  };
}

describe("progress cache", () => {
  it("writes and reads local progress", () => {
    const storage = createStorage();
    const progress = mergeDayProgress({}, 1, {
      status: "doing",
      lastReviewedAt: "2026-06-06T00:00:00.000Z"
    });

    writeLocalProgress(storage, progress);

    expect(readLocalProgress(storage)[1]).toMatchObject({ status: "doing" });
  });

  it("migrates legacy progress states", () => {
    const storage = createStorage();
    storage.setItem("ai-learning-progress", JSON.stringify({ 1: "done" }));

    expect(readLocalProgress(storage)[1]).toMatchObject({ status: "done" });
    expect(storage.raw.get("ai-learning-progress-v2")).toContain("done");
  });

  it("persists and clears quiz drafts", () => {
    const storage = createStorage();

    writeQuizDraft(storage, {
      day: 2,
      phase: "quiz",
      currentIndex: 3,
      answers: { "day-2-choice-1": "A" },
      updatedAt: "2026-06-06T00:00:00.000Z"
    });

    expect(readQuizDraft(storage, 2)).toMatchObject({ currentIndex: 3 });

    clearQuizDraft(storage, 2);

    expect(readQuizDraft(storage, 2)).toBeUndefined();
  });
});
