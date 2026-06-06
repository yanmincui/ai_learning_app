# VPS Docker + GitHub 自动部署

目标：你 push 到 GitHub 后，GitHub Actions 自动连接 VPS，拉取最新代码并用 Docker 重新构建、启动 H5 应用。

## 1. VPS 准备

VPS 不需要安装 Git，只需要 Docker、Docker Compose 和 SSH。确认 Docker 可用：

```bash
docker --version
docker compose version
```

创建应用目录即可：

```bash
sudo mkdir -p /opt/ai-learning-h5
sudo chown -R $USER:$USER /opt/ai-learning-h5
```

你可以手动在 VPS 创建 `.env`：

```bash
cat > /opt/ai-learning-h5/.env <<'EOF'
APP_PORT=3000
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=
AI_MODEL=gpt-4o-mini
EOF
```

也可以不在 VPS 手动创建 `.env`，改用 GitHub Secret `VPS_ENV` 自动写入，见下一节。

首次自动部署前，VPS 上不需要有项目代码。GitHub Actions 会把源码上传到 `/opt/ai-learning-h5`。

如需手动测试 Docker，等第一次 Actions 上传代码后再执行：

```bash
cd /opt/ai-learning-h5
docker compose up -d --build ai-learning-h5
```

访问：

```text
http://你的VPS_IP:3000
```

## 2. GitHub Secrets

在 GitHub 仓库打开：

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

新增这些 Secrets：

```text
VPS_HOST=你的VPS公网IP或域名
VPS_PORT=22
VPS_USER=你的VPS登录用户
VPS_SSH_KEY=用于登录VPS的私钥内容
VPS_APP_DIR=/opt/ai-learning-h5
VPS_ENV=完整的 .env 文件内容，可选但推荐
```

`VPS_SSH_KEY` 是 GitHub Actions 用来登录 VPS 的私钥。对应公钥要放到 VPS 的：

```text
~/.ssh/authorized_keys
```

`VPS_ENV` 示例：

```text
APP_PORT=3000
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=
AI_MODEL=gpt-4o-mini
```

## 3. 自动部署流程

当前 workflow 文件：

```text
.github/workflows/deploy-vps.yml
```

触发条件：

- push 到 `main`
- push 到 `20260528-224212-init-project-design`
- 手动点击 GitHub Actions 的 `Run workflow`

流程：

```text
GitHub push
-> GitHub Actions 运行 test/lint/build
-> SSH 登录 VPS
-> 保留 VPS 上的 .env
-> 如果配置了 VPS_ENV 且 VPS 没有 .env，则自动写入 .env
-> 上传本次提交的源码到 VPS
-> docker compose build ai-learning-h5
-> docker compose up -d ai-learning-h5
```

## 4. 域名和 Nginx

如果你要用域名访问，建议让 Nginx 反代 Docker 暴露的 3000 端口：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

配置 HTTPS：

```bash
sudo certbot --nginx -d your-domain.com
```

## 5. 新闻聚合任务

新闻聚合可以在 VPS 用 cron 调 Docker 一次性任务：

```cron
10 7 * * * cd /opt/ai-learning-h5 && docker compose run --rm ai-learning-news >> /var/log/ai-learning-news.log 2>&1
```

## 6. 常见问题

- 如果 GitHub Actions SSH 失败，检查 `VPS_SSH_KEY` 是否是私钥，公钥是否在 VPS 的 `authorized_keys`。
- 当前 workflow 是把 GitHub Actions 中的源码上传到 VPS，不要求 VPS 安装 Git，也不要求 VPS 自己能拉 GitHub。
- 如果页面没有更新，进入 VPS 执行 `docker ps` 和 `docker logs ai-learning-h5 --tail=100` 查看容器状态。
