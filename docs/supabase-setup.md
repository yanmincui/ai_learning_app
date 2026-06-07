# Supabase 搭建步骤

本项目第一版使用 Supabase 保存：

- `news_items`：AI 新闻摘要。
- `news_runs`：新闻聚合任务运行记录。
- `user_progress`：用户 30 天学习进度。
- `wechat_users`：微信登录用户最小资料。

## 1. 创建 Supabase 项目

1. 打开 Supabase 控制台。
2. 新建 Project。
3. 记录 Project URL、anon public key、service_role key。

这些值后面要写入 GitHub Secret `VPS_ENV`。

## 2. 创建数据表

进入 Supabase 项目的 SQL Editor，执行：

```text
docs/supabase-schema.sql
```

执行完成后，Table Editor 里应能看到：

```text
course_days
news_items
news_runs
user_progress
wechat_users
```

## 3. 配置 GitHub Secret

在 GitHub 仓库：

```text
Settings -> Secrets and variables -> Actions -> Repository secrets
```

编辑 `VPS_ENV`，填入 Supabase 配置：

```text
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon public key
SUPABASE_SERVICE_ROLE_KEY=你的service_role key
```

`SUPABASE_SERVICE_ROLE_KEY` 只能放服务端环境变量里，不要写进前端代码，不要提交到 GitHub。

## 4. 配置微信/小程序环境变量

微信相关配置单独放 GitHub Secret `MINI_PROGRAM_ENV`，不要放进 `VPS_ENV`。

H5/公众号网页授权：

```text
AUTH_SECRET=至少32位随机字符串
WECHAT_APP_ID=你的微信公众号AppID
WECHAT_APP_SECRET=你的微信公众号AppSecret
WECHAT_OAUTH_MODE=mp
WECHAT_OAUTH_SCOPE=snsapi_userinfo
```

小程序预留配置：

```text
WECHAT_MINI_APP_ID=你的小程序AppID
WECHAT_MINI_APP_SECRET=你的小程序AppSecret
```

## 5. 重新部署

保存 GitHub Secret 后，重新运行 GitHub Actions 部署。

部署脚本会把 `VPS_ENV` 写入 VPS，再追加 `MINI_PROGRAM_ENV`：

```text
/opt/ai-learning-h5/.env
```

## 6. 验证

在 VPS 上检查环境变量是否写入：

```bash
cd /opt/ai-learning-h5
grep -E 'SUPABASE|WECHAT|AUTH_SECRET' .env
```

检查服务：

```bash
docker compose ps
docker compose logs --tail=80 ai-learning-h5
```

检查接口：

```bash
curl -s https://ian.today/ai-learning/api/auth/session/
curl -s https://ian.today/ai-learning/api/progress/
```

未登录时，`/api/progress/` 返回空数组是正常的。微信登录并完成一天学习后，Supabase 的 `user_progress` 应出现记录。

## 7. 本地生成 AUTH_SECRET

在 VPS 上执行：

```bash
openssl rand -base64 32
```

或：

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

把输出填入：

```text
AUTH_SECRET=生成出来的随机字符串
```
