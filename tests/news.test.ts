import { describe, expect, it } from "vitest";
import { classifyNews, dedupeNews, filterRecentNews } from "@/lib/news";
import type { NewsItem } from "@/lib/types";

describe("news helpers", () => {
  it("dedupes by normalized url and title", () => {
    const items = dedupeNews([
      {
        title: "New Agent Platform",
        url: "https://example.com/a?utm=1",
        source: "A",
        publishedAt: new Date().toISOString()
      },
      {
        title: "New Agent Platform",
        url: "https://example.com/b",
        source: "B",
        publishedAt: new Date().toISOString()
      },
      {
        title: "Other Model Release",
        url: "https://example.com/a#section",
        source: "C",
        publishedAt: new Date().toISOString()
      }
    ]);

    expect(items).toHaveLength(1);
  });

  it("classifies agent and rag news", () => {
    expect(classifyNews("Agent workflow with RAG retrieval and function calling")).toBe("Agent/RAG");
  });

  it("filters news to the requested date window", () => {
    const news: NewsItem[] = [
      {
        id: "recent",
        title: "Recent",
        source: "A",
        url: "https://example.com/recent",
        publishedAt: new Date().toISOString(),
        category: "模型发布",
        summary: "recent",
        impactScore: 80
      },
      {
        id: "old",
        title: "Old",
        source: "A",
        url: "https://example.com/old",
        publishedAt: new Date(Date.now() - 40 * 86_400_000).toISOString(),
        category: "模型发布",
        summary: "old",
        impactScore: 80
      }
    ];

    expect(filterRecentNews(news, 30).map((item) => item.id)).toEqual(["recent"]);
  });
});
