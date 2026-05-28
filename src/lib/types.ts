export type CourseModule =
  | "基础认知"
  | "API实战"
  | "RAG知识库"
  | "Agent工作流"
  | "工具平台"
  | "模型工程"
  | "综合项目";

export type Difficulty = "基础" | "入门" | "进阶" | "应用" | "工程" | "综合";

export type AssessmentType = "single_choice" | "true_false" | "short_answer";

export type BaseAssessment = {
  id: string;
  type: AssessmentType;
  question: string;
  answer: string | boolean;
  explanation: string;
  sourceUrl: string;
  difficulty: Difficulty;
};

export type SingleChoiceAssessment = BaseAssessment & {
  type: "single_choice";
  options: string[];
  answer: string;
};

export type TrueFalseAssessment = BaseAssessment & {
  type: "true_false";
  answer: boolean;
};

export type ShortAnswerAssessment = BaseAssessment & {
  type: "short_answer";
  answer: string;
};

export type Assessment = SingleChoiceAssessment | TrueFalseAssessment | ShortAnswerAssessment;

export type CourseReference = {
  title: string;
  url: string;
};

export type CourseDay = {
  day: number;
  title: string;
  module: CourseModule;
  difficulty: Difficulty;
  summary: string;
  learningObjectives: string[];
  concepts: string[];
  deepDives: string[];
  tasks: string[];
  assessments: Assessment[];
  references: CourseReference[];
  recommendedBooks: CourseReference[];
  project: string;
  minutes: number;
};

export type NewsCategory = "模型发布" | "工具平台" | "Agent/RAG" | "行业应用" | "安全政策" | "开源生态";

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: NewsCategory;
  summary: string;
  impactScore: number;
};

export type UserProgress = {
  userId: string;
  day: number;
  status: "todo" | "doing" | "done";
  quizScore?: number;
  wrongQuestionIds?: string[];
  lastReviewedAt?: string;
  completedAt?: string;
};
