"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  HelpCircle,
  Home,
  ListChecks,
  Newspaper,
  Rocket,
  Target,
  UserRound,
  X
} from "lucide-react";
import type { Assessment, CourseDay, NewsItem } from "@/lib/types";
import {
  clearQuizDraft,
  mergeDayProgress,
  readQuizDraft,
  readLocalProgress,
  writeQuizDraft,
  writeLocalProgress
} from "@/lib/progress-cache";
import type { CachedDayProgress } from "@/lib/progress-cache";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Props = {
  courseDays: CourseDay[];
  newsItems: NewsItem[];
  today: CourseDay;
  updatedAt: string;
};

type DayProgress = CachedDayProgress;
type LocalProgress = Record<number, DayProgress>;
type NavId = "home" | "learning" | "news" | "projects" | "profile";

const navItems: Array<{ id: NavId; label: string; icon: typeof Home }> = [
  { id: "home", label: "首页", icon: Home },
  { id: "learning", label: "学习", icon: BookOpen },
  { id: "news", label: "新闻", icon: Newspaper },
  { id: "projects", label: "项目", icon: Rocket },
  { id: "profile", label: "我的", icon: UserRound }
];

export function AppShell({ courseDays, newsItems, today, updatedAt }: Props) {
  const [progress, setProgress] = useState<LocalProgress>({});
  const [userId, setUserId] = useState("");
  const [activeNav, setActiveNav] = useState<NavId>("home");
  const [selectedCourse, setSelectedCourse] = useState<CourseDay | null>(null);
  const completedCount = Object.values(progress).filter((item) => item.status === "done").length;
  const activeDay = Math.min(completedCount + 1, 30);
  const activeCourse = courseDays[activeDay - 1] ?? today;
  const groupedNews = useMemo(() => groupNews(newsItems), [newsItems]);
  const wrongCount = Object.values(progress).reduce((sum, item) => sum + (item.wrongQuestionIds?.length ?? 0), 0);

  useEffect(() => {
    const savedUserId =
      window.localStorage.getItem("ai-learning-user-id") ??
      `guest-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;

    setProgress(readLocalProgress(window.localStorage));
    window.localStorage.setItem("ai-learning-user-id", savedUserId);
    setUserId(savedUserId);
  }, []);

  function jumpTo(id: NavId) {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateCachedProgress(updater: (current: LocalProgress) => LocalProgress) {
    setProgress((current) => {
      const nextProgress = updater(current);
      writeLocalProgress(window.localStorage, nextProgress);
      return nextProgress;
    });
  }

  function openCourse(course: CourseDay) {
    setSelectedCourse(course);

    updateCachedProgress((current) => {
      if (current[course.day]?.status === "done") {
        return current;
      }

      return mergeDayProgress(current, course.day, {
        status: "doing",
        lastReviewedAt: new Date().toISOString()
      });
    });
  }

  async function saveDayProgress(day: number, quizScore: number, wrongQuestionIds: string[]) {
    const completedProgress: DayProgress = {
      status: "done",
      quizScore,
      wrongQuestionIds,
      lastReviewedAt: new Date().toISOString()
    };

    updateCachedProgress((current) => mergeDayProgress(current, day, completedProgress));
    clearQuizDraft(window.localStorage, day);

    if (userId) {
      await fetch(`${basePath}/api/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, day, status: "done", quizScore, wrongQuestionIds })
      }).catch(() => undefined);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[480px] pb-24">
      <section id="home" className="scroll-mt-4 px-4 pt-5">
        <div className="rounded-[28px] bg-ink p-5 text-white shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-white/65">AI 30 天学习计划</p>
              <h1 className="mt-2 text-2xl font-bold leading-tight">今天学 {activeCourse.title}</h1>
            </div>
            <button
              type="button"
              onClick={() => openCourse(activeCourse)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mint text-xl font-bold text-ink"
              title="查看今日学习内容"
            >
              D{activeDay}
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/76">{activeCourse.summary}</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Metric label="已完成" value={`${completedCount}/30`} />
            <Metric label="错题待复习" value={`${wrongCount}题`} />
            <Metric label="今日时长" value={`${activeCourse.minutes}m`} />
          </div>
        </div>
      </section>

      <section id="news" className="scroll-mt-4 px-4 pt-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-coral">最近 30 天</p>
            <h2 className="text-xl font-bold">AI 新闻 Roadmap</h2>
          </div>
          <span className="text-xs text-ink/50">{formatDate(updatedAt)} 更新</span>
        </div>
        <div className="mt-3 space-y-3">
          {groupedNews.map((group, index) => (
            <NewsNode key={group.category} index={index} category={group.category} items={group.items} />
          ))}
        </div>
      </section>

      <section id="learning" className="scroll-mt-4 px-4 pt-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-mint">30 天路线</p>
            <h2 className="text-xl font-bold">从基础知识到进阶项目</h2>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/70 shadow-sm">
            {Math.round((completedCount / 30) * 100)}%
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {courseDays.map((item) => {
            const itemProgress = progress[item.day];

            return (
              <CourseNode
                key={item.day}
                course={item}
                status={itemProgress?.status ?? (item.day === activeDay ? "doing" : "todo")}
                score={itemProgress?.quizScore}
                locked={item.day > activeDay + 2}
                onOpen={openCourse}
              />
            );
          })}
        </div>
      </section>

      <section id="projects" className="scroll-mt-4 px-4 pt-6">
        <div className="rounded-[22px] bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold text-grape">项目实战</p>
          <h2 className="mt-1 text-xl font-bold">3 个阶段作品</h2>
          <div className="mt-4 space-y-3">
            <ProjectRow day="Day 12" title="AI 问答页面" />
            <ProjectRow day="Day 21" title="企业知识库 MVP" />
            <ProjectRow day="Day 30" title="个人 AI 作品集" />
          </div>
        </div>
      </section>

      <section id="profile" className="scroll-mt-4 px-4 pt-6">
        <div className="rounded-[22px] bg-ink p-5 text-white shadow-soft">
          <p className="text-xs text-white/60">我的学习</p>
          <h2 className="mt-1 text-xl font-bold">继续保持节奏</h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            测验分数和错题会先保存在浏览器本地；配置 Supabase 后，会同步写入云端，便于后续跨设备学习。
          </p>
        </div>
      </section>

      {selectedCourse ? (
        <CourseDetail
          course={selectedCourse}
          progress={progress[selectedCourse.day]}
          onClose={() => setSelectedCourse(null)}
          onStart={() =>
            updateCachedProgress((current) =>
              mergeDayProgress(current, selectedCourse.day, {
                status: current[selectedCourse.day]?.status === "done" ? "done" : "doing",
                lastReviewedAt: new Date().toISOString()
              })
            )
          }
          onSubmit={async (quizScore, wrongQuestionIds) => {
            await saveDayProgress(selectedCourse.day, quizScore, wrongQuestionIds);
          }}
        />
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-ink/10 bg-white/92 px-3 py-2 shadow-[0_-12px_30px_rgba(23,32,51,0.10)] backdrop-blur">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeNav;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => jumpTo(item.id)}
                className={`flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold ${
                  active ? "bg-mint/15 text-ink" : "text-ink/50"
                }`}
                title={item.label}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-[11px] text-white/55">{label}</p>
      <p className="mt-1 text-base font-bold">{value}</p>
    </div>
  );
}

function NewsNode({ category, items, index }: { category: string; items: NewsItem[]; index: number }) {
  const lead = items[0];

  return (
    <article className={`relative rounded-[22px] bg-white p-4 shadow-soft ${index % 2 ? "ml-7" : "mr-7"}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sun/25 text-sun">
          <Compass size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold">{category}</h3>
            <span className="shrink-0 rounded-full bg-mist px-2 py-1 text-[11px] font-semibold text-ink/60">
              {items.length} 条
            </span>
          </div>
          {lead ? (
            <>
              <a
                href={lead.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-sm font-semibold leading-5 text-ink"
              >
                {lead.title}
              </a>
              <p className="mt-2 text-xs leading-5 text-ink/62">{lead.summary}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-ink/45">
                <span>{lead.source}</span>
                <span>影响力 {lead.impactScore}</span>
              </div>
            </>
          ) : (
            <p className="mt-2 text-xs leading-5 text-ink/55">等待新闻聚合任务写入新的摘要。</p>
          )}
        </div>
      </div>
    </article>
  );
}

function CourseNode({
  course,
  status,
  score,
  locked,
  onOpen
}: {
  course: CourseDay;
  status: "todo" | "doing" | "done";
  score?: number;
  locked: boolean;
  onOpen: (course: CourseDay) => void;
}) {
  const done = status === "done";

  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => onOpen(course)}
      className={`min-h-36 rounded-2xl p-3 text-left shadow-sm transition ${
        done
          ? "bg-mint text-white"
          : status === "doing"
            ? "bg-coral text-white"
            : locked
              ? "bg-white/55 text-ink/35"
              : "bg-white text-ink"
      }`}
      title={locked ? "完成前序学习后解锁" : `第 ${course.day} 天：${course.title}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold">第{course.day}天</span>
        {done ? <Check size={16} /> : null}
      </div>
      <h3 className="mt-2 text-sm font-bold leading-5">{course.title}</h3>
      <p className={`mt-2 text-[11px] leading-4 ${done || status === "doing" ? "text-white/75" : "text-ink/50"}`}>
        {locked ? "待解锁" : `${course.difficulty} · ${course.module}`}
      </p>
      {typeof score === "number" ? (
        <p className={`mt-2 text-[11px] font-bold ${done ? "text-white" : "text-ink/60"}`}>测验 {score} 分</p>
      ) : null}
    </button>
  );
}

function CourseDetail({
  course,
  progress,
  onClose,
  onStart,
  onSubmit
}: {
  course: CourseDay;
  progress?: DayProgress;
  onClose: () => void;
  onStart: () => void;
  onSubmit: (quizScore: number, wrongQuestionIds: string[]) => Promise<void>;
}) {
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"learn" | "quiz" | "summary">("learn");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftLoadedDay, setDraftLoadedDay] = useState<number | null>(null);
  const objectiveQuestions = course.assessments.filter((item) => item.type !== "short_answer");
  const currentAssessment = course.assessments[currentIndex];
  const currentAnswer = answers[currentAssessment.id];
  const currentAnswered =
    typeof currentAnswer === "boolean" ||
    (typeof currentAnswer === "string" && currentAnswer.trim().length > 0);
  const wrongQuestionIds = getWrongQuestionIds(objectiveQuestions, answers);
  const correctCount = objectiveQuestions.length - wrongQuestionIds.length;
  const quizScore = Math.round((correctCount / objectiveQuestions.length) * 100);
  const isLastQuestion = currentIndex === course.assessments.length - 1;

  useEffect(() => {
    const draft = readQuizDraft(window.localStorage, course.day);

    setAnswers(draft?.answers ?? {});
    setCurrentIndex(Math.min(draft?.currentIndex ?? 0, course.assessments.length - 1));
    setPhase(draft?.phase ?? "learn");
    setSubmitted(draft?.phase === "summary");
    setSaving(false);
    setDraftLoadedDay(course.day);
  }, [course.assessments.length, course.day]);

  useEffect(() => {
    if (draftLoadedDay !== course.day) {
      return;
    }

    writeQuizDraft(window.localStorage, {
      day: course.day,
      phase,
      currentIndex,
      answers,
      updatedAt: new Date().toISOString()
    });
  }, [answers, course.day, currentIndex, draftLoadedDay, phase]);

  function startQuiz() {
    onStart();
    setSubmitted(false);
    setPhase("quiz");
  }

  function updateAnswer(value: string | boolean) {
    setAnswers((current) => ({
      ...current,
      [currentAssessment.id]: value
    }));
  }

  async function goNext() {
    if (!currentAnswered) {
      return;
    }

    if (!isLastQuestion) {
      setCurrentIndex((value) => value + 1);
      return;
    }

    setSaving(true);
    await onSubmit(quizScore, wrongQuestionIds);
    setSubmitted(true);
    setPhase("summary");
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 px-3 pb-3 backdrop-blur-sm">
      <article className="max-h-[88vh] w-full max-w-[456px] overflow-y-auto rounded-[28px] bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-coral">
              第{course.day}天 · {course.difficulty} · {course.module}
            </p>
            <h2 className="mt-1 text-2xl font-bold leading-tight">{course.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist text-ink"
            title="关闭"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-ink/68">{course.summary}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoPill icon={Clock3} label="预计时长" value={`${course.minutes} 分钟`} />
          <InfoPill
            icon={Target}
            label="测验状态"
            value={typeof progress?.quizScore === "number" ? `${progress.quizScore} 分` : "未完成"}
          />
        </div>

        {phase === "learn" ? (
          <CourseLearningIntro
            course={course}
            hasDraft={Object.keys(answers).length > 0}
            onStart={startQuiz}
          />
        ) : (
          <section className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-mint" />
                <h3 className="text-base font-bold">记忆测验</h3>
              </div>
              <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ink/60">
                {submitted ? "总览" : `${currentIndex + 1}/${course.assessments.length}`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPhase("learn")}
              className="mt-3 h-10 w-full rounded-2xl bg-mist text-xs font-bold text-ink/60"
            >
              返回知识点
            </button>

            {!submitted ? (
              <div className="mt-3">
                <AssessmentCard
                  assessment={currentAssessment}
                  value={currentAnswer}
                  showExplanation={currentAnswered}
                  wasWrongBefore={progress?.wrongQuestionIds?.includes(currentAssessment.id) ?? false}
                  onChange={updateAnswer}
                />
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!currentAnswered || saving}
                  className="mt-3 h-12 w-full rounded-2xl bg-mint text-sm font-bold text-white disabled:bg-ink/15 disabled:text-ink/35"
                >
                  {isLastQuestion ? (saving ? "正在保存..." : "完成测验，查看总览") : "下一题"}
                </button>
              </div>
            ) : (
              <QuizOverview
                assessments={course.assessments}
                answers={answers}
                quizScore={quizScore}
                correctCount={correctCount}
                objectiveTotal={objectiveQuestions.length}
              />
            )}
          </section>
        )}

        {submitted ? (
          <div className="mt-5 rounded-2xl bg-mint/12 p-4">
            <p className="text-sm font-bold text-ink">本次总览：{quizScore} 分</p>
            <p className="mt-1 text-xs leading-5 text-ink/60">
              客观题答对 {correctCount}/{objectiveQuestions.length}。错题已保存在本地，用于后续复习。
            </p>
          </div>
        ) : null}

        <div className="mt-5 rounded-2xl bg-mist p-4">
          <p className="text-xs font-semibold text-ink/50">今日产出</p>
          <p className="mt-2 text-sm font-bold leading-6">{course.project}</p>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold text-ink/50">推荐书籍与资料</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {course.recommendedBooks.map((reference) => (
              <a
                key={reference.url}
                href={reference.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-coral px-3 py-2 text-xs font-semibold text-white"
              >
                {reference.title}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold text-ink/50">官方参考链接</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {course.references.map((reference) => (
              <a
                key={reference.url}
                href={reference.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white"
              >
                {reference.title}
              </a>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

function CourseLearningIntro({
  course,
  hasDraft,
  onStart
}: {
  course: CourseDay;
  hasDraft: boolean;
  onStart: () => void;
}) {
  return (
    <section className="mt-5">
      <div className="rounded-2xl bg-mint/10 p-4 ring-1 ring-mint/20">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-mint" />
          <h3 className="text-base font-bold">先学知识点</h3>
        </div>
        <p className="mt-2 text-xs leading-5 text-ink/62">
          先完成下面的概念、清单和任务，再进入 5 道记忆测验。答题进度会自动缓存在本机，退出后也可以继续。
        </p>
      </div>

      <DetailBlock icon={Target} title="学习目标" items={course.learningObjectives} />
      <KnowledgeCardList course={course} />
      <DetailBlock icon={BookOpen} title="深挖清单" items={course.deepDives} />
      <DetailBlock icon={ListChecks} title="今日任务" items={course.tasks} />

      <button
        type="button"
        onClick={onStart}
        className="mt-5 h-12 w-full rounded-2xl bg-mint text-sm font-bold text-white shadow-sm"
      >
        {hasDraft ? "继续测验" : "开始测验"}
      </button>
    </section>
  );
}

function AssessmentCard({
  assessment,
  value,
  showExplanation,
  wasWrongBefore,
  onChange
}: {
  assessment: Assessment;
  value?: string | boolean;
  showExplanation: boolean;
  wasWrongBefore: boolean;
  onChange: (value: string | boolean) => void;
}) {
  const isShort = assessment.type === "short_answer";
  const isCorrect = isShort || value === assessment.answer;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold leading-6">{assessment.question}</p>
        {wasWrongBefore ? (
          <span className="shrink-0 rounded-full bg-coral/12 px-2 py-1 text-[11px] font-bold text-coral">错题</span>
        ) : null}
      </div>

      {assessment.type === "single_choice" ? (
        <div className="mt-3 space-y-2">
          {assessment.options.map((option) => (
            <ChoiceButton
              key={option}
              active={value === option}
              label={option}
              onClick={() => onChange(option)}
            />
          ))}
        </div>
      ) : null}

      {assessment.type === "true_false" ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ChoiceButton active={value === true} label="正确" onClick={() => onChange(true)} />
          <ChoiceButton active={value === false} label="错误" onClick={() => onChange(false)} />
        </div>
      ) : null}

      {assessment.type === "short_answer" ? (
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="mt-3 w-full resize-none rounded-2xl border border-ink/10 bg-mist p-3 text-sm outline-none focus:border-mint"
          placeholder="写下你的理解或项目应用方式"
        />
      ) : null}

      {showExplanation ? (
        <div className={`mt-3 rounded-2xl p-3 ${isCorrect ? "bg-mint/10" : "bg-coral/10"}`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className={isCorrect ? "text-mint" : "text-coral"} />
            <p className="text-xs font-bold">
              {isShort ? "参考回答" : isCorrect ? "回答正确" : `正确答案：${formatAnswer(assessment.answer)}`}
            </p>
          </div>
          <p className="mt-2 text-xs leading-5 text-ink/62">{assessment.explanation}</p>
          {isShort ? <p className="mt-2 text-xs leading-5 text-ink/62">参考方向：{assessment.answer}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function QuizOverview({
  assessments,
  answers,
  quizScore,
  correctCount,
  objectiveTotal
}: {
  assessments: Assessment[];
  answers: Record<string, string | boolean>;
  quizScore: number;
  correctCount: number;
  objectiveTotal: number;
}) {
  return (
    <div className="mt-3 space-y-3">
      <div className="rounded-2xl bg-ink p-4 text-white">
        <p className="text-xs text-white/60">测验总览</p>
        <p className="mt-1 text-2xl font-bold">{quizScore} 分</p>
        <p className="mt-2 text-xs leading-5 text-white/65">
          客观题答对 {correctCount}/{objectiveTotal}，简答题用于主动回忆，不计入客观题分数。
        </p>
      </div>

      {assessments.map((assessment, index) => {
        const userAnswer = answers[assessment.id];
        const isShort = assessment.type === "short_answer";
        const isCorrect = isShort || userAnswer === assessment.answer;

        return (
          <div key={assessment.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold leading-6">
                {index + 1}. {assessment.question}
              </p>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${
                  isCorrect ? "bg-mint/12 text-mint" : "bg-coral/12 text-coral"
                }`}
              >
                {isShort ? "简答" : isCorrect ? "正确" : "错题"}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-ink/55">你的回答：{formatAnswer(userAnswer ?? "未作答")}</p>
            <p className="mt-1 text-xs leading-5 text-ink/55">参考答案：{formatAnswer(assessment.answer)}</p>
            <p className="mt-2 text-xs leading-5 text-ink/65">{assessment.explanation}</p>
          </div>
        );
      })}
    </div>
  );
}

function ChoiceButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl px-3 py-2 text-left text-sm leading-5 ${
        active ? "bg-mint text-white" : "bg-mist text-ink/70"
      }`}
    >
      {label}
    </button>
  );
}

function InfoPill({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-ink p-3 text-white">
      <div className="flex items-center gap-2 text-white/55">
        <Icon size={15} />
        <span className="text-[11px]">{label}</span>
      </div>
      <p className="mt-2 text-sm font-bold">{value}</p>
    </div>
  );
}

function DetailBlock({ icon: Icon, title, items }: { icon: typeof ListChecks; title: string; items: string[] }) {
  return (
    <section className="mt-5">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-mint" />
        <h3 className="text-base font-bold">{title}</h3>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p key={item} className="rounded-2xl bg-white p-3 text-sm leading-6 text-ink/70 shadow-sm ring-1 ring-ink/5">
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

function KnowledgeCardList({ course }: { course: CourseDay }) {
  return (
    <section className="mt-5">
      <div className="flex items-center gap-2">
        <BookOpen size={18} className="text-mint" />
        <h3 className="text-base font-bold">核心知识点</h3>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {course.concepts.map((concept) => (
          <span key={concept} className="rounded-full bg-sun/20 px-3 py-2 text-xs font-bold text-ink/70">
            {concept}
          </span>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {course.knowledgeCards.map((card) => (
          <article key={`${course.day}-${card.title}`} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <h4 className="text-sm font-bold leading-5 text-ink">{card.title}</h4>
            <p className="mt-2 text-xs leading-5 text-ink/65">{card.body}</p>
            <ul className="mt-3 space-y-2">
              {card.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-xs leading-5 text-ink/68">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <a
              href={card.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex rounded-full bg-mist px-3 py-2 text-[11px] font-bold text-ink/58"
            >
              来源：{card.sourceTitle}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectRow({ day, title }: { day: string; title: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-mist p-3">
      <span className="text-xs font-bold text-ink/45">{day}</span>
      <span className="text-sm font-bold">{title}</span>
    </div>
  );
}

function groupNews(items: NewsItem[]) {
  const categories = ["模型发布", "工具平台", "Agent/RAG", "行业应用", "安全政策", "开源生态"];
  return categories.map((category) => ({
    category,
    items: items.filter((item) => item.category === category)
  }));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatAnswer(answer: string | boolean) {
  if (typeof answer === "boolean") {
    return answer ? "正确" : "错误";
  }

  return answer;
}

function getWrongQuestionIds(assessments: Assessment[], answers: Record<string, string | boolean>) {
  return assessments.filter((assessment) => answers[assessment.id] !== assessment.answer).map((assessment) => assessment.id);
}
