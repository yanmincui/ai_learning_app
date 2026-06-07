# VPS Step by Step 安装与 GitHub 自动部署

这份文档适合你的当前情况：

- 你有一台 VPS。
- VPS 已安装 Docker。
- VPS 不需要安装 Git。
- 你希望每次更新 GitHub 后，VPS 自动更新并看到最新效果。

最终链路是：

```text
push 到 GitHub
-> GitHub Actions 自动测试和构建
-> GitHub Actions 通过 SSH 上传源码到 VPS
-> VPS 使用 Docker Compose 重新构建并启动容器
-> 网站更新
```

## 0. 你需要准备的信息

先准备这些值，后面会用到：

```text
VPS 公网 IP：例如 1.2.3.4
VPS SSH 端口：通常是 22
VPS 登录用户：例如 root 或 deploy
应用目录：/opt/ai-learning-h5
应用端口：3000
域名：可选，例如 ai.example.com
```

## 1. 在 VPS 上确认 Docker 可用

SSH 登录 VPS：

```bash
ssh root@你的VPS_IP
```

确认 Docker 和 Compose：

```bash
docker --version
docker compose version
```

如果 `docker compose version` 正常输出版本号，就可以继续。

创建应用目录：

```bash
sudo mkdir -p /opt/ai-learning-h5
sudo chown -R $USER:$USER /opt/ai-learning-h5
```

注意：这里不需要 `git clone`，因为 GitHub Actions 会上传源码。

## 2. 创建 GitHub Actions 专用 SSH Key

推荐在你本地电脑生成一把专门用于部署的 SSH Key，不要复用 GitHub 个人 key。

在本地 PowerShell 执行：

```powershell
ssh-keygen -t ed25519 -C "ai-learning-h5-deploy" -f "$HOME\.ssh\ai_learning_h5_deploy" -N '""'
```

生成后有两个文件：

```text
C:\Users\你的用户名\.ssh\ai_learning_h5_deploy
C:\Users\你的用户名\.ssh\ai_learning_h5_deploy.pub
```

查看公钥：

```powershell
Get-Content "$HOME\.ssh\ai_learning_h5_deploy.pub"
```

复制输出的整行公钥。

## 3. 把公钥放到 VPS

登录 VPS 后执行：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
```

把刚才复制的公钥粘贴进去，保存退出。

设置权限：

```bash
chmod 600 ~/.ssh/authorized_keys
```

在本地测试这把 key 能否登录 VPS：

```powershell
ssh -i "$HOME\.ssh\ai_learning_h5_deploy" root@你的VPS_IP
```

如果你的 SSH 端口不是 22：

```powershell
ssh -i "$HOME\.ssh\ai_learning_h5_deploy" -p 你的端口 root@你的VPS_IP
```

## 4. 配置 GitHub Secrets

打开 GitHub 仓库：

```text
yanmincui/ai_learning_app
```

进入：

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

依次新增这些 Secrets。

### VPS_HOST

```text
你的VPS公网IP或域名
```

例如：

```text
1.2.3.4
```

### VPS_PORT

```text
22
```

如果你的 SSH 端口不是 22，就填你的实际端口。

### VPS_USER

```text
root
```

或你的实际部署用户。

### VPS_APP_DIR

```text
/opt/ai-learning-h5
```

### VPS_SSH_KEY

复制私钥全文，不是 `.pub` 公钥。

本地查看私钥：

```powershell
Get-Content "$HOME\.ssh\ai_learning_h5_deploy"
```

复制内容时必须包含：

```text
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### VPS_ENV

推荐配置。它会自动写入 VPS 的 `/opt/ai-learning-h5/.env`。

第一版可以先这样填：

```text
APP_PORT=3000
NEXT_PUBLIC_APP_URL=http://你的VPS_IP:3000
NEXT_PUBLIC_BASE_PATH=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

AUTH_SECRET=
WECHAT_APP_ID=
WECHAT_APP_SECRET=
WECHAT_OAUTH_MODE=mp
WECHAT_OAUTH_SCOPE=snsapi_userinfo
WECHAT_MINI_APP_ID=
WECHAT_MINI_APP_SECRET=

AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=
AI_MODEL=gpt-4o-mini
NEWS_INGEST_SECRET=
```

如果你有域名，改成：

```text
NEXT_PUBLIC_APP_URL=https://你的域名
```

如果你要挂到子路径，例如：

```text
https://ian.today/ai-learning
```

则必须同时配置：

```text
NEXT_PUBLIC_APP_URL=https://ian.today/ai-learning
NEXT_PUBLIC_BASE_PATH=/ai-learning
```

## 5. 第一次触发部署

你有两种方式。

方式 A：推送代码到 GitHub。

```bash
git push
```

方式 B：在 GitHub 页面手动运行。

进入：

```text
Actions -> Deploy to VPS -> Run workflow
```

选择分支：

```text
20260528-224212-init-project-design
```

点击运行。

## 6. 查看 GitHub Actions 结果

进入：

```text
GitHub 仓库 -> Actions -> Deploy to VPS
```

你会看到两个阶段：

```text
verify
deploy
```

`verify` 会执行：

```text
pnpm install
pnpm test
pnpm lint
pnpm build
```

`deploy` 会执行：

```text
SSH 登录 VPS
上传源码
docker compose build ai-learning-h5
docker compose up -d ai-learning-h5
```

两个阶段都变绿，说明部署成功。

## 7. 在 VPS 上确认服务

登录 VPS：

```bash
ssh root@你的VPS_IP
```

进入应用目录：

```bash
cd /opt/ai-learning-h5
```

查看容器：

```bash
docker ps
```

你应该能看到：

```text
ai-learning-h5
```

查看日志：

```bash
docker logs ai-learning-h5 --tail=100
```

本机访问测试：

```bash
curl -I http://127.0.0.1:3000
```

如果返回 `HTTP/1.1 200 OK` 或类似状态，说明应用已启动。

浏览器访问：

```text
http://你的VPS_IP:3000
```

## 8. 开放防火墙端口

如果浏览器打不开，但 VPS 上 `curl http://127.0.0.1:3000` 正常，可能是防火墙或云厂商安全组没开。

CentOS firewalld：

```bash
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

云厂商控制台也要放行：

```text
TCP 3000
```

如果你后面用 Nginx + HTTPS，只需要开放：

```text
TCP 80
TCP 443
```

## 9. 配置域名和 Nginx，可选但推荐

如果你有域名，先把域名 A 记录解析到 VPS IP。

在 VPS 安装 Nginx 和 Certbot：

```bash
sudo dnf install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx
```

创建配置：

```bash
sudo nano /etc/nginx/conf.d/ai-learning-h5.conf
```

写入：

```nginx
server {
    listen 80;
    server_name 你的域名;

    location = /ai-learning {
        return 301 /ai-learning/;
    }

    location ^~ /ai-learning/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

检查并重载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

申请 HTTPS：

```bash
sudo certbot --nginx -d 你的域名
```

然后把 GitHub Secret `VPS_ENV` 里的：

```text
NEXT_PUBLIC_APP_URL=http://你的VPS_IP:3000
NEXT_PUBLIC_BASE_PATH=
```

改成：

```text
NEXT_PUBLIC_APP_URL=https://ian.today/ai-learning
NEXT_PUBLIC_BASE_PATH=/ai-learning
```

重新运行一次 GitHub Actions 部署。

## 10. 配置新闻聚合定时任务

新闻聚合任务通过 Docker 临时容器执行。

在 VPS 上编辑 crontab：

```bash
crontab -e
```

加入每天早上 7:10 执行：

```cron
10 7 * * * cd /opt/ai-learning-h5 && docker compose run --rm ai-learning-news >> /var/log/ai-learning-news.log 2>&1
```

手动测试一次：

```bash
cd /opt/ai-learning-h5
docker compose run --rm ai-learning-news
```

如果你没有配置 Supabase 或 AI_API_KEY，任务可能只抓取/摘要部分数据或不入库，这是正常的。

## 11. 以后如何更新

以后你只需要：

```text
本地修改代码
commit
push 到 GitHub
等待 GitHub Actions 变绿
刷新网站
```

VPS 不需要手动拉代码，也不需要安装 Git。

## 12. 常见问题排查

### Actions 报 Missing secrets

检查这些 Secrets 是否都配置了：

```text
VPS_HOST
VPS_PORT
VPS_USER
VPS_SSH_KEY
VPS_APP_DIR
```

### Actions SSH 失败

检查：

- `VPS_SSH_KEY` 是私钥，不是公钥。
- 私钥内容包含 begin/end 两行。
- 对应公钥已经加入 VPS 的 `~/.ssh/authorized_keys`。
- `VPS_USER` 是否正确。
- `VPS_PORT` 是否正确。

### Docker build 失败

到 GitHub Actions 查看 `deploy` 日志。

也可以在 VPS 上手动执行：

```bash
cd /opt/ai-learning-h5
docker compose build ai-learning-h5
```

### 容器启动失败

查看日志：

```bash
docker logs ai-learning-h5 --tail=200
```

### 页面还是旧版本

检查 Actions 是否成功，然后在 VPS 上看镜像和容器时间：

```bash
docker ps
docker images | head
docker logs ai-learning-h5 --tail=50
```

也可以强制重建：

```bash
cd /opt/ai-learning-h5
docker compose build --no-cache ai-learning-h5
docker compose up -d ai-learning-h5
```

### 端口被占用

查看 3000 端口：

```bash
sudo ss -lntp | grep :3000
```

如果你想换端口，修改 GitHub Secret `VPS_ENV`：

```text
APP_PORT=3001
```

然后重新部署。
