import { describe, expect, it } from "vitest";
import { assertCourseIsComplete, courseDays } from "@/lib/course";

describe("courseDays", () => {
  it("contains exactly 30 complete course days", () => {
    expect(() => assertCourseIsComplete(courseDays)).not.toThrow();
    expect(courseDays).toHaveLength(30);
  });

  it("has dense learning material, references and project output for every day", () => {
    expect(
      courseDays.every(
        (day) =>
          day.learningObjectives.length > 0 &&
          day.concepts.length > 0 &&
          day.knowledgeCards.length >= 4 &&
          day.deepDives.length >= 3 &&
          day.references.length > 0 &&
          day.recommendedBooks.length > 0 &&
          day.project.length > 0
      )
    ).toBe(true);
  });

  it("adds sourced teaching cards for core concepts", () => {
    courseDays.forEach((day) => {
      expect(day.knowledgeCards.length).toBeGreaterThanOrEqual(4);
      day.knowledgeCards.forEach((card) => {
        expect(card.body.length).toBeGreaterThan(40);
        expect(card.bullets).toHaveLength(3);
        expect(card.sourceUrl).toMatch(/^https:\/\//);
      });
    });
  });

  it("includes agentic design pattern resources in the agent module", () => {
    const agentDays = courseDays.filter((day) => day.module === "Agent工作流");
    expect(agentDays.length).toBeGreaterThan(0);
    expect(agentDays.every((day) => day.deepDives.join(" ").includes("Agentic Design Pattern"))).toBe(true);
    expect(agentDays.some((day) => day.references.some((reference) => reference.title.includes("Agents")))).toBe(true);
  });

  it("has two single-choice, two true-false and one short-answer assessment per day", () => {
    courseDays.forEach((day) => {
      expect(day.assessments.filter((assessment) => assessment.type === "single_choice")).toHaveLength(2);
      expect(day.assessments.filter((assessment) => assessment.type === "true_false")).toHaveLength(2);
      expect(day.assessments.filter((assessment) => assessment.type === "short_answer")).toHaveLength(1);
    });
  });

  it("has valid answer structures and explanations", () => {
    courseDays.flatMap((day) => day.assessments).forEach((assessment) => {
      expect(assessment.explanation.length).toBeGreaterThan(0);
      expect(assessment.sourceUrl).toMatch(/^https:\/\//);

      if (assessment.type === "single_choice") {
        expect(assessment.options).toHaveLength(4);
        expect(assessment.options).toContain(assessment.answer);
      }

      if (assessment.type === "true_false") {
        expect(typeof assessment.answer).toBe("boolean");
      }
    });
  });
});
