# AI 30 天学习 H5/PWA

面向有基础编程能力的 AI 开发入门者的 30 天学习 H5 应用。首页直接展示最近 30 天 AI 新闻摘要 roadmap、今日学习任务和学习进度。

## 功能

- 移动端优先的 Next.js App Router 应用
- 30 天 AI 学习路线、每日任务、测验和项目
- AI 新闻聚合、去重、分类、摘要脚本
- Supabase 存储新闻和学习进度
- PWA manifest + service worker 离线缓存
- CentOS Stream 9 VPS 部署文档

## 本地开发

```bash
pnpm install
pnpm dev
```

## 常用命令

```bash
pnpm test
pnpm build
pnpm ingest:news
```

部署到 VPS 见 [docs/deployment-centos9.md](docs/deployment-centos9.md)。
