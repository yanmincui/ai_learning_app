export type CachedDayProgress = {
  status: "todo" | "doing" | "done";
  quizScore?: number;
  wrongQuestionIds?: string[];
  lastReviewedAt?: string;
};

export type CachedQuizDraft = {
  day: number;
  phase: "learn" | "quiz" | "summary";
  currentIndex: number;
  answers: Record<string, string | boolean>;
  updatedAt: string;
};

export type CachedProgressMap = Record<number, CachedDayProgress>;
export type CachedDraftMap = Record<number, CachedQuizDraft>;

const PROGRESS_KEY = "ai-learning-progress-v2";
const LEGACY_PROGRESS_KEY = "ai-learning-progress";
const DRAFT_KEY = "ai-learning-quiz-drafts-v1";

type BrowserStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function readLocalProgress(storage: BrowserStorage): CachedProgressMap {
  const savedProgress = readJson<CachedProgressMap>(storage, PROGRESS_KEY);
  if (savedProgress) {
    return savedProgress;
  }

  const legacyProgress = readJson<Record<number, "todo" | "doing" | "done">>(storage, LEGACY_PROGRESS_KEY);
  if (!legacyProgress) {
    return {};
  }

  const migrated = Object.fromEntries(
    Object.entries(legacyProgress).map(([day, status]) => [day, { status }])
  ) as CachedProgressMap;

  writeLocalProgress(storage, migrated);
  return migrated;
}

export function writeLocalProgress(storage: BrowserStorage, progress: CachedProgressMap) {
  storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function mergeDayProgress(
  progress: CachedProgressMap,
  day: number,
  nextDayProgress: CachedDayProgress
): CachedProgressMap {
  return {
    ...progress,
    [day]: {
      ...progress[day],
      ...nextDayProgress
    }
  };
}

export function readQuizDraft(storage: BrowserStorage, day: number): CachedQuizDraft | undefined {
  return readQuizDrafts(storage)[day];
}

export function writeQuizDraft(storage: BrowserStorage, draft: CachedQuizDraft) {
  const drafts = readQuizDrafts(storage);
  drafts[draft.day] = draft;
  storage.setItem(DRAFT_KEY, JSON.stringify(drafts));
}

export function clearQuizDraft(storage: BrowserStorage, day: number) {
  const drafts = readQuizDrafts(storage);
  delete drafts[day];
  storage.setItem(DRAFT_KEY, JSON.stringify(drafts));
}

function readQuizDrafts(storage: BrowserStorage): CachedDraftMap {
  return readJson<CachedDraftMap>(storage, DRAFT_KEY) ?? {};
}

function readJson<T>(storage: BrowserStorage, key: string): T | undefined {
  const raw = storage.getItem(key);
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    storage.removeItem(key);
    return undefined;
  }
}
