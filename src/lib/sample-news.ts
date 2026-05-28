import type { NewsItem } from "./types";

export const sampleNews: NewsItem[] = [
  {
    id: "sample-openai-agents",
    title: "OpenAI 发布新的 Agent 开发能力",
    source: "OpenAI",
    url: "https://openai.com/news/",
    publishedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    category: "Agent/RAG",
    summary: "新的 Agent 工具链强化了函数调用、长任务执行和应用集成能力，适合 Day 16-18 的 Agent 学习主题。",
    impactScore: 92
  },
  {
    id: "sample-deepmind-model",
    title: "Google DeepMind 更新多模态模型研究进展",
    source: "Google DeepMind",
    url: "https://deepmind.google/discover/blog/",
    publishedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    category: "模型发布",
    summary: "多模态推理和长上下文能力继续提升，学习者应关注图像理解、文档解析和评测方法。",
    impactScore: 88
  },
  {
    id: "sample-huggingface-open-source",
    title: "Hugging Face 社区出现新的开源推理优化工具",
    source: "Hugging Face",
    url: "https://huggingface.co/blog",
    publishedAt: new Date(Date.now() - 8 * 86_400_000).toISOString(),
    category: "开源生态",
    summary: "开源生态继续围绕低成本推理和部署体验迭代，可作为 Day 25-27 模型工程模块的延伸阅读。",
    impactScore: 81
  },
  {
    id: "sample-anthropic-safety",
    title: "Anthropic 分享 AI 安全与企业落地实践",
    source: "Anthropic",
    url: "https://www.anthropic.com/news",
    publishedAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    category: "安全政策",
    summary: "企业部署更重视权限、数据边界和可观测性，适合与知识库项目和监控模块结合学习。",
    impactScore: 84
  },
  {
    id: "sample-industry-bi",
    title: "AI BI 与运营助手成为企业应用热点",
    source: "Industry Radar",
    url: "https://news.google.com/search?q=AI%20BI",
    publishedAt: new Date(Date.now() - 18 * 86_400_000).toISOString(),
    category: "行业应用",
    summary: "自然语言查询、报表解释和营销内容生成正在融合，适合 Day 29 的综合项目训练。",
    impactScore: 78
  },
  {
    id: "sample-tools-cursor",
    title: "AI 编程工具持续强化项目级上下文能力",
    source: "Developer Tools",
    url: "https://news.google.com/search?q=AI%20coding%20tools",
    publishedAt: new Date(Date.now() - 24 * 86_400_000).toISOString(),
    category: "工具平台",
    summary: "AI IDE 的代码理解和重构能力提升，学习者应同步训练需求拆解、测试和代码审查习惯。",
    impactScore: 75
  }
];
