import { XMLParser } from "fast-xml-parser";
import { createSupabaseServerClient } from "./supabase";
import { sampleNews } from "./sample-news";
import type { NewsCategory, NewsItem } from "./types";

export const newsSources = [
  { name: "OpenAI", url: "https://openai.com/news/rss.xml", type: "rss" },
  { name: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml", type: "rss" },
  { name: "Anthropic", url: "https://www.anthropic.com/news", type: "html" },
  { name: "Hugging Face", url: "https://huggingface.co/blog/feed.xml", type: "rss" }
] as const;

const categoryKeywords: Record<NewsCategory, string[]> = {
  模型发布: ["model", "gpt", "gemini", "claude", "llama", "multimodal", "reasoning", "模型"],
  工具平台: ["cursor", "developer", "platform", "studio", "tool", "workflow", "工具"],
  "Agent/RAG": ["agent", "rag", "retrieval", "function calling", "mcp", "知识库"],
  行业应用: ["enterprise", "business", "health", "education", "finance", "industry", "应用"],
  安全政策: ["safety", "policy", "security", "alignment", "risk", "governance", "安全"],
  开源生态: ["open source", "github", "hugging face", "community", "release", "开源"]
};

type RawFeedItem = {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  description?: string;
};

export function classifyNews(text: string): NewsCategory {
  const haystack = text.toLowerCase();
  const scores = Object.entries(categoryKeywords).map(([category, keywords]) => ({
    category: category as NewsCategory,
    score: keywords.filter((keyword) => haystack.includes(keyword.toLowerCase())).length
  }));

  scores.sort((a, b) => b.score - a.score);
  return scores[0]?.score ? scores[0].category : "行业应用";
}

export function normalizeTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function dedupeNews(items: RawFeedItem[]) {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  return items.filter((item) => {
    const normalizedTitle = normalizeTitle(item.title);
    const normalizedUrl = item.url.replace(/[#?].*$/, "");

    if (seenUrls.has(normalizedUrl) || seenTitles.has(normalizedTitle)) {
      return false;
    }

    seenUrls.add(normalizedUrl);
    seenTitles.add(normalizedTitle);
    return true;
  });
}

export function filterRecentNews(items: NewsItem[], days = 30) {
  const cutoff = Date.now() - days * 86_400_000;
  return items
    .filter((item) => new Date(item.publishedAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getNewsItems(days = 30): Promise<NewsItem[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return filterRecentNews(sampleNews, days);
  }

  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const { data, error } = await supabase
    .from("news_items")
    .select("id,title,source,url,published_at,category,summary,impact_score")
    .gte("published_at", since)
    .order("published_at", { ascending: false })
    .limit(60);

  if (error || !data?.length) {
    return filterRecentNews(sampleNews, days);
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    source: item.source,
    url: item.url,
    publishedAt: item.published_at,
    category: item.category,
    summary: item.summary,
    impactScore: item.impact_score
  }));
}

export async function fetchSourceFeed(source: (typeof newsSources)[number]): Promise<RawFeedItem[]> {
  const response = await fetch(source.url, {
    headers: {
      "User-Agent": "ai-learning-h5-news-ingestor/0.1"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.name}: ${response.status}`);
  }

  const body = await response.text();

  if (source.type === "html") {
    return parseNewsLinksFromHtml(source.name, source.url, body);
  }

  const xml = body;
  const parsed = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: ""
  }).parse(xml);

  const channelItems = parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? [];
  const items = Array.isArray(channelItems) ? channelItems : [channelItems];

  return items
    .map((item) => {
      const link = typeof item.link === "string" ? item.link : item.link?.href ?? item.guid ?? "";
      const date = item.pubDate ?? item.published ?? item.updated ?? new Date().toISOString();

      return {
        title: String(item.title ?? "").trim(),
        url: String(link).trim(),
        source: source.name,
        publishedAt: new Date(date).toISOString(),
        description: String(item.description ?? item.summary ?? item.content ?? "").replace(/<[^>]+>/g, "")
      };
    })
    .filter((item) => item.title && item.url);
}

function parseNewsLinksFromHtml(source: string, baseUrl: string, html: string): RawFeedItem[] {
  const matches = Array.from(html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi));
  const newsLinks = matches
    .map((match) => {
      const url = new URL(match[1], baseUrl).toString();
      const title = match[2]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        title,
        url,
        source,
        publishedAt: new Date().toISOString(),
        description: title
      };
    })
    .filter((item) => item.title.length > 8 && item.url.includes("/news"));

  return dedupeNews(newsLinks).slice(0, 20);
}

export async function summarizeNews(item: RawFeedItem): Promise<NewsItem> {
  const category = classifyNews(`${item.title} ${item.description ?? ""}`);
  const fallbackSummary = (item.description || item.title).slice(0, 140);
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    return toNewsItem(item, category, fallbackSummary);
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "你是 AI 新闻编辑。用中文输出 50 字以内摘要，说明它对 AI 学习者的意义，不要编造原文没有的信息。"
          },
          {
            role: "user",
            content: `标题：${item.title}\n来源：${item.source}\n内容：${item.description ?? ""}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`AI summarizer failed: ${response.status}`);
    }

    const json = await response.json();
    const summary = String(json.choices?.[0]?.message?.content ?? fallbackSummary).trim();
    return toNewsItem(item, category, summary);
  } catch {
    return toNewsItem(item, category, fallbackSummary);
  }
}

export async function ingestNews() {
  const rawResults = await Promise.allSettled(newsSources.map((source) => fetchSourceFeed(source)));
  const failures = rawResults.flatMap((result, index) =>
    result.status === "rejected" ? [`${newsSources[index].name}: ${String(result.reason)}`] : []
  );
  const rawItems = rawResults.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  const recentRaw = dedupeNews(rawItems).filter(
    (item) => new Date(item.publishedAt).getTime() >= Date.now() - 30 * 86_400_000
  );
  const summarized = await Promise.all(recentRaw.slice(0, 40).map((item) => summarizeNews(item)));
  const supabase = createSupabaseServerClient();
  let stored = 0;

  if (supabase && summarized.length) {
    const { error } = await supabase.from("news_items").upsert(
      summarized.map((item) => ({
        id: item.id,
        title: item.title,
        source: item.source,
        url: item.url,
        published_at: item.publishedAt,
        category: item.category,
        summary: item.summary,
        impact_score: item.impactScore
      })),
      { onConflict: "url" }
    );

    if (error) {
      failures.push(`Supabase upsert failed: ${error.message}`);
    } else {
      stored = summarized.length;
    }
  }

  if (supabase) {
    await supabase.from("news_runs").insert({
      fetched_count: rawItems.length,
      inserted_count: stored,
      failed_sources: failures,
      status: failures.length ? "partial" : "ok"
    });
  }

  return {
    fetched: rawItems.length,
    summarized: summarized.length,
    stored,
    failures
  };
}

function toNewsItem(item: RawFeedItem, category: NewsCategory, summary: string): NewsItem {
  return {
    id: stableId(item.url || item.title),
    title: item.title,
    source: item.source,
    url: item.url,
    publishedAt: item.publishedAt,
    category,
    summary,
    impactScore: scoreImpact(item.title, item.description)
  };
}

function scoreImpact(title: string, description = "") {
  const text = `${title} ${description}`.toLowerCase();
  const highImpact = ["launch", "release", "open source", "agent", "model", "safety", "enterprise"];
  const score = 68 + highImpact.filter((keyword) => text.includes(keyword)).length * 5;
  return Math.min(score, 98);
}

function stableId(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  return `news-${Math.abs(hash)}`;
}
