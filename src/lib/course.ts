import type { Assessment, CourseDay, CourseModule, Difficulty } from "./types";

const refs = {
  openaiPrompt: {
    title: "OpenAI Prompt Engineering",
    url: "https://platform.openai.com/docs/guides/prompt-engineering"
  },
  openaiStructured: {
    title: "OpenAI Structured Outputs",
    url: "https://platform.openai.com/docs/guides/structured-outputs"
  },
  openaiEmbeddings: {
    title: "OpenAI Embeddings",
    url: "https://platform.openai.com/docs/guides/embeddings"
  },
  openaiAgents: {
    title: "OpenAI Agents",
    url: "https://platform.openai.com/docs/guides/agents"
  },
  openaiAgentGuide: {
    title: "OpenAI A Practical Guide to Building Agents",
    url: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf"
  },
  anthropicAgents: {
    title: "Anthropic Building Effective Agents",
    url: "https://www.anthropic.com/engineering/building-effective-agents"
  },
  dlaiAgentic: {
    title: "DeepLearning.AI Agentic Design Patterns",
    url: "https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/"
  },
  googleLlms: {
    title: "Google ML Crash Course: Large Language Models",
    url: "https://developers.google.com/machine-learning/crash-course/llm?hl=zh-cn"
  },
  googleMl: {
    title: "Google Machine Learning Crash Course",
    url: "https://developers.google.com/machine-learning"
  },
  huggingFace: {
    title: "Hugging Face LLM Course",
    url: "https://huggingface.co/learn/nlp-course/chapter1/1"
  },
  aiEngineering: {
    title: "AI Engineering - Chip Huyen",
    url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/"
  },
  buildLlmFromScratch: {
    title: "Build a Large Language Model From Scratch - Sebastian Raschka",
    url: "https://www.manning.com/books/build-a-large-language-model-from-scratch"
  },
  designingMlSystems: {
    title: "Designing Machine Learning Systems - Chip Huyen",
    url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/"
  },
  llmEngineersHandbook: {
    title: "LLM Engineer's Handbook",
    url: "https://www.packtpub.com/en-us/product/llm-engineers-handbook-9781836200079"
  },
  langchainRag: {
    title: "LangChain RAG",
    url: "https://docs.langchain.com/oss/python/langchain/rag"
  },
  langchainRetrieval: {
    title: "LangChain Retrieval",
    url: "https://docs.langchain.com/oss/python/langchain/retrieval"
  },
  langchainEval: {
    title: "LangSmith Evaluation Approaches",
    url: "https://docs.langchain.com/langsmith/evaluation-approaches"
  },
  pytorch: {
    title: "PyTorch Learn the Basics",
    url: "https://docs.pytorch.org/tutorials/beginner/basics/intro.html"
  },
  dify: {
    title: "Dify Knowledge Pipeline",
    url: "https://docs.dify.ai/en/guides/knowledge-base/knowledge-pipeline/readme"
  },
  nextRoute: {
    title: "Next.js Route Handlers",
    url: "https://nextjs.org/docs/app/getting-started/route-handlers"
  },
  supabaseAuth: {
    title: "Supabase JavaScript Auth",
    url: "https://supabase.com/docs/reference/javascript/auth-api"
  },
  mcp: {
    title: "Model Context Protocol",
    url: "https://modelcontextprotocol.io/docs"
  }
} as const;

const moduleDeepDives: Record<CourseModule, string[]> = {
  基础认知: [
    "把 LLM 原理、Transformer 直觉、Token 成本和幻觉风险串成一张概念图。",
    "阅读一本模型原理书的目录，标出你现在能理解和暂时跳过的章节。",
    "用真实产品拆解模型、数据、提示词和评测四个层次。"
  ],
  API实战: [
    "为每个 API 调用补齐超时、重试、限流、日志和用户可读错误。",
    "把 Prompt 模板沉淀为可测试资产，而不是散落在页面里。",
    "用结构化输出把模型回答变成可校验、可存储、可回放的数据。"
  ],
  RAG知识库: [
    "围绕解析、切分、索引、召回、重排、引用和反馈建立完整 Pipeline。",
    "用固定问题集比较 chunk、topK、metadata filter 和 rerank 的效果。",
    "为每条回答保留来源、片段和置信判断，避免只展示流畅文本。"
  ],
  Agent工作流: [
    "按 Reflection、Tool Use、Planning、Multi-Agent 四类 Agentic Design Pattern 拆任务。",
    "为 Agent 设计预算、停止条件、权限边界和人工确认点。",
    "把工具 schema、执行日志和失败恢复作为 Agent 的一等能力。"
  ],
  工具平台: [
    "用 Dify/Coze 快速验证业务流程，再判断哪些环节需要自研工程化。",
    "关注知识库权限、更新、命中率、用户反馈和运营指标。",
    "把低代码平台输出当作原型和流程说明，而不是最终架构的全部。"
  ],
  模型工程: [
    "用 ML/DL 基础解释训练、泛化、评测、微调和推理部署的关系。",
    "比较 RAG、Prompt、Fine-tuning 和 Agent 对同一业务问题的不同作用。",
    "把成本、延迟、质量、安全和可观测性纳入模型工程设计。"
  ],
  综合项目: [
    "把 AI 搜索、AI BI、营销助手拆成输入、工具、模型、数据和评测。",
    "为作品集写清问题背景、技术方案、效果指标、失败处理和复盘。",
    "用岗位 JD 反推下一阶段要补的系统设计、评测和部署能力。"
  ]
};

const moduleBooks: Record<CourseModule, Array<(typeof refs)[keyof typeof refs]>> = {
  基础认知: [refs.buildLlmFromScratch, refs.huggingFace, refs.googleLlms],
  API实战: [refs.aiEngineering, refs.openaiPrompt, refs.openaiStructured],
  RAG知识库: [refs.aiEngineering, refs.llmEngineersHandbook, refs.langchainRag],
  Agent工作流: [refs.openaiAgentGuide, refs.anthropicAgents, refs.dlaiAgentic],
  工具平台: [refs.aiEngineering, refs.dify],
  模型工程: [refs.designingMlSystems, refs.buildLlmFromScratch, refs.pytorch],
  综合项目: [refs.aiEngineering, refs.designingMlSystems, refs.openaiAgentGuide]
};

type CourseSeed = Omit<CourseDay, "assessments" | "deepDives" | "recommendedBooks"> & {
  quizFocus: string;
  choiceOne: { question: string; options: string[]; answer: string; explanation: string };
  choiceTwo: { question: string; options: string[]; answer: string; explanation: string };
  trueFalseOne: { question: string; answer: boolean; explanation: string };
  trueFalseTwo: { question: string; answer: boolean; explanation: string };
  reflection: { question: string; answer: string; explanation: string };
};

const seeds: CourseSeed[] = [
  seed(1, "什么是 LLM、Token、上下文、参数", "基础认知", "基础", "Token/上下文/幻觉判断", 45, [
    "解释 LLM 的基本输入输出",
    "理解 Token、上下文窗口和幻觉的关系",
    "判断一个任务是否适合交给 LLM"
  ], ["大语言模型", "Token", "上下文窗口", "幻觉"], ["画出一次用户问题到模型回答的流程", "记录 3 个适合 LLM 的学习或工作场景"], "完成个人 AI 学习术语卡片", [refs.googleLlms, refs.huggingFace], {
    question: "Token 在 LLM 应用中主要影响什么？",
    options: ["成本、上下文容量和生成长度", "电脑显卡颜色", "网页字体大小", "数据库表数量"],
    answer: "成本、上下文容量和生成长度",
    explanation: "模型通常按 Token 处理文本，输入输出 Token 会影响费用、延迟和能放入上下文的信息量。"
  }, {
    question: "当模型给出看似合理但事实错误的内容时，通常称为？",
    options: ["幻觉", "压缩", "索引", "归一化"],
    answer: "幻觉",
    explanation: "幻觉是生成模型可能编造或错误陈述事实的现象，需要通过检索、引用和评测降低风险。"
  }, {
    question: "上下文窗口越大，模型就一定不会产生幻觉。",
    answer: false,
    explanation: "更大的上下文能放入更多信息，但不能保证模型始终正确理解和引用。"
  }, {
    question: "LLM 更擅长语言理解、生成、归纳和改写类任务。",
    answer: true,
    explanation: "这是 LLM 的强项，但涉及实时事实、精确计算和高风险决策时需要工具或人工校验。"
  }),
  seed(2, "Transformer 与自注意力直觉", "基础认知", "基础", "LLM 为什么能处理长上下文", 50, [
    "用直觉解释 Transformer",
    "理解注意力机制如何关联上下文",
    "区分训练和推理"
  ], ["Transformer", "自注意力", "训练", "推理"], ["用自己的话解释自注意力", "找一个长文摘要场景并标出关键信息依赖"], "画一张 Transformer 直觉流程图", [refs.googleLlms, refs.huggingFace], {
    question: "自注意力机制最核心的作用是？",
    options: ["让模型在序列中关注相关 Token", "给网页添加动画", "压缩图片大小", "删除训练数据"],
    answer: "让模型在序列中关注相关 Token",
    explanation: "自注意力帮助模型判断当前 Token 与上下文中其他 Token 的相关性。"
  }, {
    question: "推理阶段指的是？",
    options: ["使用训练好的模型生成输出", "人工标注全部数据", "重新设计芯片", "删除模型参数"],
    answer: "使用训练好的模型生成输出",
    explanation: "训练是学习参数，推理是用已经训练好的参数处理新输入。"
  }, {
    question: "Transformer 只能处理英文文本，不能处理中文。",
    answer: false,
    explanation: "现代分词和训练数据支持多语言，中文也能被编码为 Token 后处理。"
  }, {
    question: "长上下文能帮助模型利用更多输入材料，但仍需要良好的提示和检索策略。",
    answer: true,
    explanation: "上下文变长不等于信息自动可用，关键信息组织方式仍会影响效果。"
  }),
  seed(3, "AI 应用开发全景：模型、提示词、工具、数据", "基础认知", "基础", "AI 应用 vs 传统应用", 50, [
    "理解 AI 应用的核心模块",
    "区分模型能力和业务流程",
    "识别评测与监控的重要性"
  ], ["模型 API", "提示词", "工具调用", "数据闭环"], ["拆解一个 AI 产品的输入、处理和输出", "标注其中的模型、工具和数据来源"], "完成一个 AI 应用功能拆解表", [refs.openaiAgents, refs.nextRoute], {
    question: "AI 应用相比传统 CRUD 最大的不确定性通常来自？",
    options: ["模型输出可能不稳定", "按钮不能点击", "网页不能部署", "数据库不能新增字段"],
    answer: "模型输出可能不稳定",
    explanation: "生成式模型输出受提示、上下文和概率影响，因此需要评测、约束和降级策略。"
  }, {
    question: "AI 应用中工具调用的作用是？",
    options: ["让模型连接真实系统或函数", "替换所有数据库", "关闭网络请求", "减少页面颜色"],
    answer: "让模型连接真实系统或函数",
    explanation: "工具调用可把模型的语言能力连接到查询、计算、检索和业务操作。"
  }, {
    question: "只要接入最强模型，就不需要产品流程设计。",
    answer: false,
    explanation: "模型能力必须嵌入清晰的用户流程、数据权限和失败处理。"
  }, {
    question: "AI 应用需要关注成本、延迟、质量和安全。",
    answer: true,
    explanation: "这些指标会直接影响用户体验和运营可行性。"
  }),
  seed(4, "OpenAI-compatible API、消息角色、错误处理", "API实战", "基础", "system/user/assistant 区分", 60, [
    "理解 Chat API 消息结构",
    "区分 system、user、assistant 消息",
    "处理鉴权、超时和重试"
  ], ["Chat API", "message role", "API Key", "错误处理"], ["调用一次 OpenAI-compatible API", "为失败请求设计用户可读提示"], "做一个命令行问答助手", [refs.openaiPrompt], {
    question: "system message 通常用于放什么？",
    options: ["全局角色、规则和边界", "用户密码明文", "CSS 样式", "数据库备份"],
    answer: "全局角色、规则和边界",
    explanation: "system message 用于设置模型行为和约束，优先级通常高于普通用户输入。"
  }, {
    question: "API Key 最合适保存在哪里？",
    options: ["服务端环境变量", "前端 localStorage", "URL 查询参数", "公开 Git 仓库"],
    answer: "服务端环境变量",
    explanation: "密钥不能暴露给浏览器或仓库，应放在服务端安全环境变量中。"
  }, {
    question: "assistant message 可以作为多轮对话历史的一部分。",
    answer: true,
    explanation: "保留 assistant 历史有助于模型理解对话上下文。"
  }, {
    question: "遇到 401 鉴权错误时，最佳做法是无限重试。",
    answer: false,
    explanation: "鉴权错误通常需要检查密钥或权限，无限重试只会浪费资源。"
  }),
  seed(5, "Prompt Engineering：任务、约束、示例、格式", "API实战", "基础", "zero-shot/few-shot 使用场景", 55, [
    "写出结构化 Prompt",
    "使用示例提升稳定性",
    "为输出添加格式和边界"
  ], ["任务说明", "约束", "few-shot", "输出格式"], ["重写 3 个模糊 Prompt", "对比有无示例时模型输出的差异"], "沉淀 5 条可复用提示词模板", [refs.openaiPrompt], {
    question: "Few-shot Prompt 最适合用来做什么？",
    options: ["提供输入输出示例", "安装依赖", "压缩图片", "替换数据库索引"],
    answer: "提供输入输出示例",
    explanation: "Few-shot 通过示例告诉模型期望的格式、风格和判断标准。"
  }, {
    question: "一个好的 Prompt 通常不包含？",
    options: ["含糊的目标和没有约束的要求", "任务背景", "输出格式", "评价标准"],
    answer: "含糊的目标和没有约束的要求",
    explanation: "模糊目标会导致输出漂移，应该明确任务、约束和格式。"
  }, {
    question: "Prompt 中可以要求模型先列出判断依据再输出结论。",
    answer: true,
    explanation: "让模型按步骤组织输出常能提高可读性，但高风险结论仍需验证。"
  }, {
    question: "Prompt Engineering 可以彻底替代评测。",
    answer: false,
    explanation: "Prompt 能改善输出，但仍需要用样例集和指标验证稳定性。"
  }),
  seed(6, "Structured Outputs 与 JSON Schema", "API实战", "基础", "JSON mode vs schema adherence", 60, [
    "理解结构化输出的价值",
    "用 schema 约束模型输出",
    "处理解析失败和重试"
  ], ["JSON Schema", "结构化输出", "校验", "降级"], ["设计一个标签提取 schema", "实现解析失败后的重试提示"], "做一个文章标签提取器", [refs.openaiStructured], {
    question: "结构化输出最直接解决的问题是？",
    options: ["让模型输出更容易被程序解析", "提高显示器亮度", "减少服务器内存条", "自动创建域名"],
    answer: "让模型输出更容易被程序解析",
    explanation: "JSON Schema 能让后续程序可靠读取字段，减少脆弱的字符串解析。"
  }, {
    question: "即使使用结构化输出，服务端仍应该做什么？",
    options: ["校验返回数据", "跳过错误处理", "公开 API Key", "删除日志"],
    answer: "校验返回数据",
    explanation: "任何外部输出进入业务系统前都应校验，确保字段和类型符合预期。"
  }, {
    question: "JSON mode 和严格 schema 约束完全等价。",
    answer: false,
    explanation: "JSON mode 强调可解析 JSON，严格 schema 更强调字段结构符合定义。"
  }, {
    question: "结构化输出适合分类、抽取、表单生成等场景。",
    answer: true,
    explanation: "这些场景需要稳定字段，适合用 schema 约束。"
  }),
  seed(7, "Cursor/AI IDE 辅助编程工作流", "API实战", "入门", "AI 生成代码的验证方式", 50, [
    "掌握 AI IDE 的阅读和修改流程",
    "把需求拆成小步任务",
    "用测试验证 AI 生成代码"
  ], ["代码上下文", "小步迭代", "测试", "代码审查"], ["让 AI 解释一个模块", "让 AI 生成测试并人工审查"], "用 AI IDE 完成一个小工具页面", [refs.nextRoute], {
    question: "使用 AI IDE 改代码时，最稳妥的做法是？",
    options: ["小步修改并运行测试", "一次性改完整个仓库", "不看 diff 直接提交", "删除所有类型"],
    answer: "小步修改并运行测试",
    explanation: "小步修改能降低风险，让问题更容易定位。"
  }, {
    question: "AI 生成的代码应该如何处理？",
    options: ["像同事提交的代码一样审查", "永远完全相信", "禁止运行测试", "只看文件名"],
    answer: "像同事提交的代码一样审查",
    explanation: "AI 代码也可能误解需求或引入 bug，需要审查、测试和运行验证。"
  }, {
    question: "给 AI 提供当前文件、错误信息和目标，比只说“修一下”更有效。",
    answer: true,
    explanation: "上下文越清楚，模型越容易给出可用修改。"
  }, {
    question: "AI IDE 可以替代开发者对业务规则的理解。",
    answer: false,
    explanation: "开发者仍需定义目标、边界和验收标准。"
  }),
  seed(8, "Embeddings、相似度、语义检索", "RAG知识库", "入门", "向量表示和关键词检索区别", 60, [
    "理解文本向量表示",
    "比较语义检索和关键词检索",
    "设计一个相似问题检索 demo"
  ], ["Embedding", "向量相似度", "语义检索", "召回"], ["把 5 句话转成检索样例", "比较关键词命中和语义命中"], "完成相似问题检索 demo", [refs.openaiEmbeddings, refs.langchainRetrieval], {
    question: "Embedding 的主要作用是？",
    options: ["把文本表示为可比较的向量", "把网页变成图片", "直接执行 SQL", "替代所有数据库"],
    answer: "把文本表示为可比较的向量",
    explanation: "向量可用于计算语义相似度，从而支持检索和推荐。"
  }, {
    question: "语义检索相比关键词检索的优势是？",
    options: ["能找到表达不同但含义相近的内容", "永远不需要索引", "完全不消耗成本", "只能处理英文"],
    answer: "能找到表达不同但含义相近的内容",
    explanation: "Embedding 捕捉语义相似度，不完全依赖字面关键词。"
  }, {
    question: "Embedding 模型通常负责生成最终长文本回答。",
    answer: false,
    explanation: "Embedding 主要用于表示和检索，最终回答通常由生成模型完成。"
  }, {
    question: "向量检索结果仍然需要结合业务规则和质量评估。",
    answer: true,
    explanation: "相似不等于正确，召回结果需要过滤、排序和评测。"
  }),
  seed(9, "文档切分、chunk、metadata、topK", "RAG知识库", "入门", "chunk 大小与召回质量", 65, [
    "理解文档切分策略",
    "设计元数据字段",
    "调整 topK 和过滤条件"
  ], ["chunk", "metadata", "topK", "向量数据库"], ["设计一份 FAQ 的切分策略", "写出向量库字段结构"], "搭建课程资料索引设计", [refs.langchainRetrieval], {
    question: "chunk 太大通常会带来什么问题？",
    options: ["噪声变多且上下文浪费", "索引必然更准确", "模型不再需要检索", "数据库自动消失"],
    answer: "噪声变多且上下文浪费",
    explanation: "过大的 chunk 可能包含不相关信息，影响召回和生成。"
  }, {
    question: "metadata 常用于什么？",
    options: ["按来源、时间、权限等过滤检索结果", "改变用户手机型号", "加密前端按钮", "删除文本语义"],
    answer: "按来源、时间、权限等过滤检索结果",
    explanation: "元数据能帮助检索阶段做过滤和溯源。"
  }, {
    question: "topK 越大，回答质量一定越高。",
    answer: false,
    explanation: "topK 太大可能引入噪声，太小可能漏召回，需要评测调参。"
  }, {
    question: "文档切分应该结合内容结构，而不是只按固定字符数。",
    answer: true,
    explanation: "标题、段落、表格等结构会影响 chunk 的完整性。"
  }),
  seed(10, "RAG 基础链路：检索、增强、生成、引用", "RAG知识库", "入门", "RAG 如何降低幻觉", 70, [
    "掌握 RAG 的四步流程",
    "为回答添加来源引用",
    "理解 RAG 的局限"
  ], ["检索增强生成", "引用", "上下文注入", "幻觉控制"], ["画出 RAG 数据流", "实现带引用的回答提示词"], "做一个资料问答助手", [refs.langchainRag], {
    question: "RAG 中的增强通常指什么？",
    options: ["把检索到的相关资料加入模型上下文", "把按钮放大", "删除用户问题", "关闭引用"],
    answer: "把检索到的相关资料加入模型上下文",
    explanation: "RAG 用外部资料增强模型回答，减少仅凭参数记忆生成。"
  }, {
    question: "RAG 回答显示引用的主要价值是？",
    options: ["让用户能追溯依据", "让页面更占空间", "隐藏错误", "减少所有成本"],
    answer: "让用户能追溯依据",
    explanation: "引用能提高可信度，也方便用户核对原始资料。"
  }, {
    question: "只要用了 RAG，就不会有错误回答。",
    answer: false,
    explanation: "检索可能漏召回或召回错误，生成也可能误读资料。"
  }, {
    question: "RAG 适合需要结合私有文档或最新资料的问答场景。",
    answer: true,
    explanation: "这些信息通常不在模型参数中，适合通过检索注入。"
  }),
  seed(11, "RAG 优化：query rewrite、rerank、citation", "RAG知识库", "进阶", "检索质量 vs 生成质量", 70, [
    "理解查询改写",
    "使用重排提升召回质量",
    "把引用和答案片段对应起来"
  ], ["query rewrite", "rerank", "citation", "召回评测"], ["为同一问题生成 3 个改写", "设计引用片段展示规则"], "优化知识库问答命中率", [refs.langchainRag, refs.langchainRetrieval], {
    question: "query rewrite 主要解决什么？",
    options: ["把用户问题改写成更适合检索的查询", "修改服务器系统时间", "替换所有资料", "自动生成域名证书"],
    answer: "把用户问题改写成更适合检索的查询",
    explanation: "用户原问题可能口语化或信息不足，改写能提升召回。"
  }, {
    question: "rerank 的作用是？",
    options: ["对初始召回结果重新排序", "删除模型输出", "关闭数据库", "只生成图片"],
    answer: "对初始召回结果重新排序",
    explanation: "重排器可进一步判断文档与问题的相关性。"
  }, {
    question: "生成质量差一定说明检索质量差。",
    answer: false,
    explanation: "问题可能来自检索、提示词、上下文组织或模型本身，需要分层排查。"
  }, {
    question: "引用应该尽量对应到实际支持答案的片段。",
    answer: true,
    explanation: "泛泛引用整篇文档会降低可核验性。"
  }),
  seed(12, "Next.js H5 问答应用实战", "RAG知识库", "进阶", "API Key 为什么放服务端", 80, [
    "用 Route Handler 封装 AI 请求",
    "实现移动端问答 UI",
    "处理加载、错误和空状态"
  ], ["Next.js Route Handler", "服务端 API", "移动端交互", "环境变量"], ["实现一个问答 API", "做移动端输入和回答展示"], "发布第一个 AI 问答页面", [refs.nextRoute, refs.supabaseAuth], {
    question: "Next.js Route Handler 在 AI 应用中常用于？",
    options: ["在服务端处理 API 请求和密钥", "改变手机屏幕尺寸", "替代浏览器", "删除 CSS"],
    answer: "在服务端处理 API 请求和密钥",
    explanation: "Route Handler 能保护密钥并把前端请求转发到模型或数据库。"
  }, {
    question: "移动端问答页面最应该优先保证？",
    options: ["输入、加载、错误和结果状态清晰", "文字越小越好", "按钮无反馈", "页面不能滚动"],
    answer: "输入、加载、错误和结果状态清晰",
    explanation: "AI 请求有延迟和失败概率，状态设计会直接影响体验。"
  }, {
    question: "前端代码里可以安全写死模型 API Key。",
    answer: false,
    explanation: "前端代码会被用户下载，密钥必须放服务端。"
  }, {
    question: "H5 AI 应用也需要处理弱网和失败重试。",
    answer: true,
    explanation: "移动端网络不稳定，失败状态和降级体验很重要。"
  }),
  seed(13, "Text-to-SQL 与只读安全边界", "Agent工作流", "进阶", "SQL 注入/权限限制", 70, [
    "理解 Text-to-SQL 工作流",
    "设置只读权限和白名单",
    "识别危险 SQL"
  ], ["Text-to-SQL", "只读权限", "SQL 注入", "结果解释"], ["写一个只读 SQL 生成提示", "列出危险 SQL 示例"], "做一个销售数据查询助手方案", [refs.openaiStructured], {
    question: "Text-to-SQL 上线前最重要的安全措施之一是？",
    options: ["限制为只读查询", "允许任意 DROP TABLE", "公开数据库密码", "跳过审核"],
    answer: "限制为只读查询",
    explanation: "自然语言生成 SQL 存在误操作风险，生产环境应限制权限和语句类型。"
  }, {
    question: "生成 SQL 后还应该做什么？",
    options: ["语法和权限校验", "直接执行所有语句", "删除日志", "关闭数据库备份"],
    answer: "语法和权限校验",
    explanation: "校验可防止危险语句、越权访问和无效查询。"
  }, {
    question: "Text-to-SQL 可以完全绕过业务权限系统。",
    answer: false,
    explanation: "自然语言入口也必须遵守用户权限和数据边界。"
  }, {
    question: "查询结果解释需要提示用户核对关键指标口径。",
    answer: true,
    explanation: "BI 场景中指标定义差异可能导致决策误读。"
  }),
  seed(14, "LangChain 链式编排与工具调用", "Agent工作流", "进阶", "chain、tool、state 区别", 65, [
    "理解链式任务拆解",
    "设计工具输入输出",
    "维护任务状态"
  ], ["chain", "tool", "state", "workflow"], ["拆解一个研究报告生成任务", "定义每步输入输出"], "设计一个研究报告生成链", [refs.langchainRag], {
    question: "链式编排最适合什么场景？",
    options: ["需要多个步骤协同完成的任务", "只显示静态文本", "完全不需要状态的按钮", "删除所有工具"],
    answer: "需要多个步骤协同完成的任务",
    explanation: "复杂任务通常需要检索、分析、生成、校验等多个步骤。"
  }, {
    question: "工具定义中最关键的是？",
    options: ["清晰的输入输出 schema", "随机函数名", "隐藏所有错误", "只写中文名"],
    answer: "清晰的输入输出 schema",
    explanation: "schema 能帮助模型正确调用工具，也方便程序校验参数。"
  }, {
    question: "chain、tool、state 是同一个概念。",
    answer: false,
    explanation: "chain 是流程，tool 是可调用能力，state 是执行中的上下文数据。"
  }, {
    question: "工作流每一步都应该有明确的失败处理。",
    answer: true,
    explanation: "多步骤系统中任何一步失败都可能影响最终结果。"
  }),
  seed(15, "AI 应用评测：样例集、rubric、回归测试", "Agent工作流", "进阶", "evals 的作用", 60, [
    "建立评测样例集",
    "设计评分标准",
    "做版本回归对比"
  ], ["eval", "rubric", "golden set", "回归测试"], ["制作 10 条评测样例", "定义 3 个评分维度"], "建立项目评测表", [refs.langchainEval], {
    question: "AI 应用评测样例集的作用是？",
    options: ["稳定比较不同版本质量", "替代所有用户反馈", "让页面更漂亮", "删除日志"],
    answer: "稳定比较不同版本质量",
    explanation: "固定样例能帮助判断 prompt、模型或检索改动是否带来退化。"
  }, {
    question: "rubric 指的是？",
    options: ["评分标准", "服务器端口", "图片尺寸", "数据库密码"],
    answer: "评分标准",
    explanation: "rubric 定义什么样的回答算好、一般或失败。"
  }, {
    question: "只测试一个成功样例就足够上线。",
    answer: false,
    explanation: "上线前需要覆盖常见、边界和失败场景。"
  }, {
    question: "评测应同时关注质量、成本、延迟和安全。",
    answer: true,
    explanation: "AI 应用的可用性不只取决于答案是否看起来正确。"
  }),
  seed(16, "Function Calling / Tool Calling", "Agent工作流", "进阶", "schema、参数校验、失败处理", 75, [
    "设计可调用工具",
    "让模型选择工具",
    "处理工具失败和参数错误"
  ], ["function calling", "tool schema", "参数校验", "重试"], ["设计一个天气查询工具", "校验工具调用参数"], "做一个带工具的个人助理", [refs.openaiAgents, refs.openaiStructured], {
    question: "Tool Calling 中 schema 的作用是？",
    options: ["描述工具参数结构", "压缩网页图片", "隐藏网络请求", "改变模型供应商"],
    answer: "描述工具参数结构",
    explanation: "schema 告诉模型需要提供哪些参数，也便于服务端校验。"
  }, {
    question: "工具执行失败时应该？",
    options: ["返回可处理的错误并决定是否重试", "让程序崩溃", "伪造成功", "删除用户问题"],
    answer: "返回可处理的错误并决定是否重试",
    explanation: "工具失败是常见情况，需要降级、重试或提示用户。"
  }, {
    question: "模型选择工具后，服务端仍应校验参数。",
    answer: true,
    explanation: "模型输出不是可信输入，服务端必须校验。"
  }, {
    question: "Tool Calling 只能调用天气工具。",
    answer: false,
    explanation: "它可以连接检索、计算、业务系统等多种函数。"
  }),
  seed(17, "MCP：工具、资源、上下文协议", "Agent工作流", "进阶", "MCP 解决的接入问题", 60, [
    "理解 MCP 的工具和资源",
    "识别协议化接入价值",
    "设计一个 MCP 资源清单"
  ], ["MCP", "resource", "tool", "protocol"], ["列出一个 MCP 服务可暴露的资源", "设计工具接入流程"], "写出工具接入设计文档", [refs.mcp], {
    question: "MCP 主要想解决什么问题？",
    options: ["让 AI 应用以统一方式连接工具和上下文", "替代所有前端框架", "只生成图片", "关闭数据库"],
    answer: "让 AI 应用以统一方式连接工具和上下文",
    explanation: "协议化可以降低不同工具接入 AI 客户端的成本。"
  }, {
    question: "MCP resource 可以表示什么？",
    options: ["可被读取的上下文或数据", "手机电量", "CSS 颜色", "随机动画"],
    answer: "可被读取的上下文或数据",
    explanation: "资源用于向模型提供上下文，工具则用于执行动作。"
  }, {
    question: "协议化接入可以减少每个工具都重复适配的成本。",
    answer: true,
    explanation: "统一协议能让客户端和工具服务以稳定方式交互。"
  }, {
    question: "MCP 让所有工具调用都不需要权限控制。",
    answer: false,
    explanation: "协议不等于免权限，工具仍需鉴权、授权和审计。"
  }),
  seed(18, "Agent：计划、执行、观察、停止条件", "Agent工作流", "进阶", "Agent 风险边界", 70, [
    "理解 Agent loop",
    "设置停止条件和权限边界",
    "识别失控风险"
  ], ["plan-act-observe", "memory", "guardrail", "停止条件"], ["拆解一个 Agent loop", "为任务设置停止条件"], "做一个网页资料整理 Agent 原型", [refs.openaiAgents], {
    question: "Agent 与普通单次问答的重要区别是？",
    options: ["Agent 可多步计划并调用工具", "Agent 只能回答 yes/no", "Agent 不能访问上下文", "Agent 不需要约束"],
    answer: "Agent 可多步计划并调用工具",
    explanation: "Agent 通常包含计划、行动、观察和继续决策。"
  }, {
    question: "Agent 必须设置停止条件的原因是？",
    options: ["避免无限循环和越界操作", "让按钮更圆", "减少中文字符", "阻止用户输入"],
    answer: "避免无限循环和越界操作",
    explanation: "多步系统需要明确预算、权限和结束标准。"
  }, {
    question: "Agent 拥有工具权限后，可以不经过审计直接执行高风险操作。",
    answer: false,
    explanation: "高风险操作需要人类确认、权限控制和日志审计。"
  }, {
    question: "Agent 适合信息收集、流程编排和半自动任务执行。",
    answer: true,
    explanation: "这些场景需要多步行动和工具协作。"
  }),
  seed(19, "Dify/Coze 低代码应用与工作流", "工具平台", "应用", "workflow/chatflow/knowledge", 60, [
    "理解低代码 AI 平台组件",
    "区分 chatflow 和 workflow",
    "快速搭建知识库问答"
  ], ["Dify", "Coze", "workflow", "knowledge base"], ["搭建一个问答 bot", "配置知识库或插件"], "发布一个客服问答 bot", [refs.dify], {
    question: "低代码 AI 平台最适合？",
    options: ["快速验证业务流程和原型", "替代所有工程能力", "隐藏所有数据来源", "绕过权限审批"],
    answer: "快速验证业务流程和原型",
    explanation: "低代码平台能加速原型和运营，但复杂系统仍需要工程治理。"
  }, {
    question: "知识库节点通常用于？",
    options: ["检索业务资料并注入上下文", "修改浏览器内核", "删除用户进度", "创建服务器账号"],
    answer: "检索业务资料并注入上下文",
    explanation: "知识库是低代码 RAG 应用的重要组件。"
  }, {
    question: "低代码平台不需要测试和验收。",
    answer: false,
    explanation: "低代码流程也可能出错，仍要测试典型问题和边界场景。"
  }, {
    question: "workflow 更适合多步骤、可控的数据处理流程。",
    answer: true,
    explanation: "工作流能显式组织节点、变量和条件分支。"
  }),
  seed(20, "知识库 Pipeline：解析、切分、索引、召回", "工具平台", "应用", "知识库生命周期", 70, [
    "理解知识库构建生命周期",
    "设计文档更新流程",
    "评估召回质量"
  ], ["解析", "切分", "索引", "召回评测"], ["阅读知识库 Pipeline 文档", "创建一个更新策略"], "搭建企业知识库 MVP 数据流", [refs.dify, refs.langchainRetrieval], {
    question: "知识库 Pipeline 的典型顺序是？",
    options: ["解析、切分、索引、召回", "召回、删除、忘记、关机", "部署、买域名、换颜色、截图", "训练、删除、压缩、发布"],
    answer: "解析、切分、索引、召回",
    explanation: "知识库需要先把资料处理成可检索结构，再用于问答。"
  }, {
    question: "知识库更新流程需要关注？",
    options: ["增量更新、版本和失效内容", "只关注图标", "忽略来源", "删除旧日志"],
    answer: "增量更新、版本和失效内容",
    explanation: "资料会变化，知识库需要维护新旧版本和内容有效性。"
  }, {
    question: "知识库上线后就不需要运营。",
    answer: false,
    explanation: "需要持续更新内容、收集反馈和优化召回。"
  }, {
    question: "召回质量可以用测试问题集持续评估。",
    answer: true,
    explanation: "固定问题集能帮助比较不同切分和检索策略。"
  }),
  seed(21, "企业知识库 MVP：权限、更新、反馈", "工具平台", "应用", "知识库运营指标", 75, [
    "设计企业知识库权限",
    "建立用户反馈闭环",
    "定义运营指标"
  ], ["权限", "反馈", "运营指标", "审计"], ["设计知识库内容来源", "定义反馈字段"], "完成企业知识库方案", [refs.dify, refs.supabaseAuth], {
    question: "企业知识库最需要避免的问题之一是？",
    options: ["越权访问敏感资料", "页面过于清晰", "引用太准确", "用户能反馈"],
    answer: "越权访问敏感资料",
    explanation: "企业资料有权限边界，检索和回答都必须遵守。"
  }, {
    question: "知识库反馈按钮的价值是？",
    options: ["收集错误、缺失和满意度信号", "让页面更长", "删除资料", "替代权限"],
    answer: "收集错误、缺失和满意度信号",
    explanation: "反馈能指导内容补充和检索优化。"
  }, {
    question: "所有员工都应该默认看到所有知识库内容。",
    answer: false,
    explanation: "企业知识库应按角色、部门或项目控制访问。"
  }, {
    question: "知识库运营应关注命中率、满意度和未回答问题。",
    answer: true,
    explanation: "这些指标能反映内容覆盖和回答质量。"
  }),
  seed(22, "多模态：图片、文档、语音输入", "模型工程", "应用", "多模态隐私与质量风险", 65, [
    "理解多模态输入类型",
    "识别隐私和质量风险",
    "设计文档解析流程"
  ], ["视觉理解", "OCR", "语音", "隐私"], ["测试一次图片理解", "设计一个文档解析流程"], "做一个图片内容摘要器", [refs.openaiAgents], {
    question: "多模态模型相比纯文本模型多处理了什么？",
    options: ["图片、音频或文档等非文本输入", "只能处理数字 0", "只能执行 SQL", "只能生成 CSS"],
    answer: "图片、音频或文档等非文本输入",
    explanation: "多模态模型能把图像、音频等信号纳入理解和生成流程。"
  }, {
    question: "上传合同截图给模型前最应该检查？",
    options: ["是否包含敏感信息和权限风险", "图片是否足够好看", "按钮颜色", "页面标题长度"],
    answer: "是否包含敏感信息和权限风险",
    explanation: "多模态输入可能包含隐私、身份和商业敏感信息。"
  }, {
    question: "OCR 和视觉理解结果永远准确。",
    answer: false,
    explanation: "图像质量、版式和模型能力都会影响识别准确性。"
  }, {
    question: "多模态应用也需要引用、置信度或人工复核机制。",
    answer: true,
    explanation: "尤其在文档、医疗、法律等高风险场景。"
  }),
  seed(23, "Fine-tuning 适用场景与数据准备", "模型工程", "进阶", "RAG vs 微调", 70, [
    "判断是否需要微调",
    "理解训练样例格式",
    "区分 RAG 和微调"
  ], ["fine-tuning", "训练样例", "RAG", "评测"], ["判断 3 个场景是否需要微调", "整理 20 条训练样例格式"], "写出微调可行性报告", [refs.huggingFace, refs.openaiPrompt], {
    question: "Fine-tuning 更适合改善什么？",
    options: ["稳定风格、格式或特定任务模式", "注入大量实时私有知识", "替代数据库权限", "自动消除所有幻觉"],
    answer: "稳定风格、格式或特定任务模式",
    explanation: "微调适合行为模式学习；大量知识更新通常更适合 RAG。"
  }, {
    question: "微调前最应该准备什么？",
    options: ["高质量训练和评测样例", "随机复制网页", "删除基线", "跳过测试"],
    answer: "高质量训练和评测样例",
    explanation: "数据质量直接决定微调效果，评测用于判断是否真的提升。"
  }, {
    question: "RAG 和微调解决的问题完全相同。",
    answer: false,
    explanation: "RAG 偏知识注入和可追溯，微调偏行为和格式稳定。"
  }, {
    question: "微调上线后仍需要监控质量和成本。",
    answer: true,
    explanation: "微调模型也可能退化、漂移或成本不划算。"
  }),
  seed(24, "质量监控：成本、延迟、安全、反馈", "模型工程", "进阶", "线上监控指标", 65, [
    "设计 AI 应用监控指标",
    "记录失败和反馈",
    "建立告警和回滚策略"
  ], ["质量", "成本", "延迟", "安全"], ["设计指标面板", "写出失败告警规则"], "完成 AI 应用监控清单", [refs.langchainEval], {
    question: "AI 应用监控不应只看什么？",
    options: ["单一准确率", "延迟", "成本", "失败率"],
    answer: "单一准确率",
    explanation: "生产可用性还包含成本、速度、安全和用户满意度。"
  }, {
    question: "用户负反馈最适合用来？",
    options: ["定位失败模式并改进样例集", "直接忽略", "删除用户账号", "关闭监控"],
    answer: "定位失败模式并改进样例集",
    explanation: "反馈能帮助发现测试集未覆盖的问题。"
  }, {
    question: "模型升级后不需要做回归测试。",
    answer: false,
    explanation: "不同模型可能改变输出行为，必须回归验证。"
  }, {
    question: "成本和延迟是 AI 产品体验的一部分。",
    answer: true,
    explanation: "成本决定商业可持续，延迟直接影响用户使用感受。"
  }),
  seed(25, "ML 基础：数据集、特征、泛化、过拟合", "模型工程", "基础", "训练/验证/测试集", 60, [
    "理解训练、验证、测试集",
    "解释过拟合和泛化",
    "认识特征和标签"
  ], ["训练集", "验证集", "测试集", "过拟合"], ["画出机器学习训练流程", "解释一个分类任务的数据结构"], "整理 ML 基础速查表", [refs.googleMl], {
    question: "测试集的主要用途是？",
    options: ["评估模型在未见数据上的表现", "参与每一步训练调参", "保存用户密码", "替代标签"],
    answer: "评估模型在未见数据上的表现",
    explanation: "测试集应尽量模拟新数据，用于最终泛化评估。"
  }, {
    question: "过拟合指的是？",
    options: ["训练数据表现好但新数据表现差", "模型完全不能训练", "网页加载失败", "数据库断开"],
    answer: "训练数据表现好但新数据表现差",
    explanation: "过拟合说明模型记住了训练细节而不是学到可泛化规律。"
  }, {
    question: "验证集常用于模型选择和调参。",
    answer: true,
    explanation: "验证集帮助比较不同超参数或模型方案。"
  }, {
    question: "训练集、验证集、测试集可以随意混用。",
    answer: false,
    explanation: "混用会造成数据泄漏，让评估结果过于乐观。"
  }),
  seed(26, "神经网络、反向传播、优化直觉", "模型工程", "基础", "loss/gradient/optimizer", 65, [
    "理解神经网络基本结构",
    "解释损失函数和梯度",
    "了解优化器的作用"
  ], ["神经网络", "loss", "gradient", "optimizer"], ["画出一个三层神经网络", "用一句话解释梯度下降"], "完成神经网络概念图", [refs.googleMl, refs.pytorch], {
    question: "损失函数用于衡量什么？",
    options: ["预测与真实目标的差距", "网页宽度", "服务器数量", "用户年龄"],
    answer: "预测与真实目标的差距",
    explanation: "训练过程通过降低损失来改进模型参数。"
  }, {
    question: "梯度告诉优化器什么？",
    options: ["参数调整方向和幅度的信息", "浏览器语言", "数据库端口", "CSS 类名"],
    answer: "参数调整方向和幅度的信息",
    explanation: "梯度用于指导参数更新，让损失逐步下降。"
  }, {
    question: "反向传播用于计算参数对损失的影响。",
    answer: true,
    explanation: "它是训练神经网络的核心算法之一。"
  }, {
    question: "优化器的作用是随机删除训练样例。",
    answer: false,
    explanation: "优化器根据梯度更新参数。"
  }),
  seed(27, "PyTorch 基础工作流", "模型工程", "工程", "tensor/dataloader/model", 70, [
    "理解 Tensor 和 Dataset",
    "读懂训练循环",
    "认识模型、损失和优化器"
  ], ["Tensor", "Dataset", "DataLoader", "training loop"], ["读懂一个 PyTorch 训练循环", "标注输入、模型、损失和优化器"], "完成 PyTorch 工作流图", [refs.pytorch], {
    question: "PyTorch 中 Tensor 通常表示？",
    options: ["多维数组/数值张量", "网页链接", "数据库连接池", "路由路径"],
    answer: "多维数组/数值张量",
    explanation: "Tensor 是深度学习计算的基础数据结构。"
  }, {
    question: "训练循环通常包含？",
    options: ["前向计算、损失、反向传播、参数更新", "只刷新页面", "只写 CSS", "删除数据集"],
    answer: "前向计算、损失、反向传播、参数更新",
    explanation: "这是监督学习训练的典型步骤。"
  }, {
    question: "DataLoader 可以帮助批量读取数据。",
    answer: true,
    explanation: "它常用于 batch、shuffle 和并行加载。"
  }, {
    question: "训练模型时不需要损失函数。",
    answer: false,
    explanation: "没有损失函数就缺少优化目标。"
  }),
  seed(28, "模型部署与推理服务", "模型工程", "工程", "限流、缓存、资源成本", 70, [
    "理解推理服务架构",
    "设计限流和缓存",
    "估算资源成本"
  ], ["推理服务", "限流", "缓存", "部署"], ["比较服务端和端侧部署", "列出推理服务资源需求"], "写出模型部署方案", [refs.nextRoute], {
    question: "推理服务为什么需要限流？",
    options: ["保护成本和稳定性", "让用户永远不能访问", "删除模型", "关闭日志"],
    answer: "保护成本和稳定性",
    explanation: "模型推理成本高且耗资源，限流能防止滥用和雪崩。"
  }, {
    question: "缓存适合什么请求？",
    options: ["重复且结果可复用的请求", "每次都不同的敏感操作", "用户密码输入", "必须实时变化的数据"],
    answer: "重复且结果可复用的请求",
    explanation: "缓存能降低延迟和成本，但要注意时效性和隐私。"
  }, {
    question: "端侧部署一定比服务端部署更简单。",
    answer: false,
    explanation: "端侧部署受设备性能、模型大小和兼容性影响。"
  }, {
    question: "部署方案应包含监控、回滚和容量预估。",
    answer: true,
    explanation: "生产系统需要可观察和可恢复。"
  }),
  seed(29, "AI 搜索 / AI BI / 营销助手综合项目", "综合项目", "综合", "场景拆解与安全校验", 85, [
    "拆解综合 AI 产品场景",
    "组合检索、工具和生成能力",
    "加入安全校验"
  ], ["AI 搜索", "AI BI", "营销助手", "安全校验"], ["设计搜索结果卡片", "生成一组带审核规则的营销文案"], "完成 AI 运营助手方案", [refs.langchainRag, refs.openaiStructured], {
    question: "综合 AI 项目最先应该明确什么？",
    options: ["用户场景、输入输出和成功标准", "页面背景音乐", "随机技术栈", "按钮数量"],
    answer: "用户场景、输入输出和成功标准",
    explanation: "场景和验收标准决定技术组合和评测方式。"
  }, {
    question: "AI BI 场景为什么需要安全校验？",
    options: ["避免越权查询和错误决策", "让图表变大", "关闭数据库", "禁止用户提问"],
    answer: "避免越权查询和错误决策",
    explanation: "BI 结果会影响业务判断，必须控制权限和解释口径。"
  }, {
    question: "营销助手生成的内容可以不经审核直接群发。",
    answer: false,
    explanation: "营销内容涉及品牌、合规和事实准确性，需要审核机制。"
  }, {
    question: "综合项目应把引用、日志和反馈纳入设计。",
    answer: true,
    explanation: "这些能力能提升可信度和持续优化能力。"
  }),
  seed(30, "作品集整理与岗位能力对照", "综合项目", "综合", "项目复盘与下一步路线", 90, [
    "整理 30 天产出",
    "把项目转化为作品集",
    "对照岗位能力规划下一阶段"
  ], ["作品集", "项目复盘", "岗位能力", "学习路线"], ["整理 3 个作品截图", "写出岗位技能匹配表"], "发布个人 AI 学习作品集", [refs.openaiAgents, refs.nextRoute], {
    question: "作品集最应该展示什么？",
    options: ["问题、方案、实现、效果和复盘", "只放工具 logo", "只写学习口号", "隐藏项目链接"],
    answer: "问题、方案、实现、效果和复盘",
    explanation: "招聘或合作方更关心你如何解决问题，而不只是用了什么工具。"
  }, {
    question: "岗位能力对照表的作用是？",
    options: ["发现能力缺口并规划下一阶段", "替代所有项目经验", "删除简历", "隐藏不足"],
    answer: "发现能力缺口并规划下一阶段",
    explanation: "对照岗位要求能让学习目标更具体。"
  }, {
    question: "项目复盘只需要写成功点，不需要写问题。",
    answer: false,
    explanation: "问题和改进计划能体现工程判断和成长能力。"
  }, {
    question: "30 天结束后应继续围绕真实业务项目深化。",
    answer: true,
    explanation: "真实项目能训练需求、数据、评测和部署的完整能力。"
  })
];

export const courseDays: CourseDay[] = seeds.map((item) => ({
  day: item.day,
  title: item.title,
  module: item.module,
  difficulty: item.difficulty,
  summary: item.summary,
  learningObjectives: item.learningObjectives,
  concepts: item.concepts,
  deepDives: moduleDeepDives[item.module],
  tasks: item.tasks,
  assessments: buildAssessments(item),
  references: uniqueReferences([...item.references, ...moduleBooks[item.module]]),
  recommendedBooks: moduleBooks[item.module],
  project: item.project,
  minutes: item.minutes
}));

export function getTodayCourse(startDate = "2026-05-29") {
  const start = new Date(`${startDate}T00:00:00`);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const day = Math.min(Math.max(diffDays + 1, 1), courseDays.length);
  return courseDays[day - 1];
}

export function assertCourseIsComplete(days = courseDays) {
  if (days.length !== 30) {
    throw new Error(`Expected 30 course days, received ${days.length}`);
  }

  days.forEach((item, index) => {
    const expectedDay = index + 1;
    const choiceQuestions = item.assessments.filter((assessment) => assessment.type === "single_choice");
    const trueFalseQuestions = item.assessments.filter((assessment) => assessment.type === "true_false");
    const shortAnswerQuestions = item.assessments.filter((assessment) => assessment.type === "short_answer");

    if (
      item.day !== expectedDay ||
      !item.title ||
      !item.learningObjectives.length ||
      !item.concepts.length ||
      !item.deepDives.length ||
      !item.tasks.length ||
      !item.project ||
      !item.references.length ||
      !item.recommendedBooks.length
    ) {
      throw new Error(`Invalid course day at index ${index}`);
    }

    if (choiceQuestions.length !== 2 || trueFalseQuestions.length !== 2 || shortAnswerQuestions.length !== 1) {
      throw new Error(`Invalid assessment mix for day ${item.day}`);
    }

    choiceQuestions.forEach((assessment) => {
      if (assessment.options.length !== 4 || !assessment.options.includes(assessment.answer)) {
        throw new Error(`Invalid single choice assessment ${assessment.id}`);
      }
    });
  });
}

function uniqueReferences(references: CourseDay["references"]) {
  const seen = new Set<string>();
  return references.filter((reference) => {
    if (seen.has(reference.url)) {
      return false;
    }

    seen.add(reference.url);
    return true;
  });
}

function seed(
  day: number,
  title: string,
  module: CourseModule,
  difficulty: Difficulty,
  quizFocus: string,
  minutes: number,
  learningObjectives: string[],
  concepts: string[],
  tasks: string[],
  project: string,
  references: CourseSeed["references"],
  choiceOne: CourseSeed["choiceOne"],
  choiceTwo: CourseSeed["choiceTwo"],
  trueFalseOne: CourseSeed["trueFalseOne"],
  trueFalseTwo: CourseSeed["trueFalseTwo"]
): CourseSeed {
  return {
    day,
    title,
    module,
    difficulty,
    quizFocus,
    summary: `${title}。本日重点：${quizFocus}。`,
    learningObjectives,
    concepts,
    tasks,
    project,
    references,
    minutes,
    choiceOne,
    choiceTwo,
    trueFalseOne,
    trueFalseTwo,
    reflection: {
      question: `用 3 句话说明“${title}”如何用于你的 AI 学习或项目。`,
      answer: `能够说清核心概念、适用场景和一个可落地动作即可。`,
      explanation: "简答题用于主动回忆和迁移应用，不做机器自动判错。"
    }
  };
}

function buildAssessments(item: CourseSeed): Assessment[] {
  const sourceUrl = item.references[0]?.url ?? "https://platform.openai.com/docs";

  return [
    {
      id: `day-${item.day}-choice-1`,
      type: "single_choice",
      question: item.choiceOne.question,
      options: item.choiceOne.options,
      answer: item.choiceOne.answer,
      explanation: item.choiceOne.explanation,
      sourceUrl,
      difficulty: item.difficulty
    },
    {
      id: `day-${item.day}-choice-2`,
      type: "single_choice",
      question: item.choiceTwo.question,
      options: item.choiceTwo.options,
      answer: item.choiceTwo.answer,
      explanation: item.choiceTwo.explanation,
      sourceUrl,
      difficulty: item.difficulty
    },
    {
      id: `day-${item.day}-tf-1`,
      type: "true_false",
      question: item.trueFalseOne.question,
      answer: item.trueFalseOne.answer,
      explanation: item.trueFalseOne.explanation,
      sourceUrl,
      difficulty: item.difficulty
    },
    {
      id: `day-${item.day}-tf-2`,
      type: "true_false",
      question: item.trueFalseTwo.question,
      answer: item.trueFalseTwo.answer,
      explanation: item.trueFalseTwo.explanation,
      sourceUrl,
      difficulty: item.difficulty
    },
    {
      id: `day-${item.day}-short-1`,
      type: "short_answer",
      question: item.reflection.question,
      answer: item.reflection.answer,
      explanation: item.reflection.explanation,
      sourceUrl,
      difficulty: item.difficulty
    }
  ];
}
