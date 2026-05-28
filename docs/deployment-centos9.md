# CentOS Stream 9 VPS 部署

以下命令假设域名已经解析到 VPS，应用目录为 `/opt/ai-learning-h5`，运行端口为 `3000`。

## 1. 安装运行环境

```bash
sudo dnf update -y
sudo dnf install -y nginx git cronie certbot python3-certbot-nginx
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install -y nodejs
sudo corepack enable
sudo npm i -g pm2
sudo systemctl enable --now nginx crond
```

## 2. 获取代码并配置环境变量

```bash
sudo mkdir -p /opt/ai-learning-h5
sudo chown -R $USER:$USER /opt/ai-learning-h5
git clone git@github.com:yanmincui/ai_learning_app.git /opt/ai-learning-h5
cd /opt/ai-learning-h5
cp .env.example .env
pnpm install --frozen-lockfile
```

填写 `.env`：

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=...
AI_MODEL=gpt-4o-mini
```

## 3. 构建并用 PM2 运行

```bash
pnpm build
pm2 start .next/standalone/server.js --name ai-learning-h5 -- --hostname 127.0.0.1 --port 3000
pm2 save
pm2 startup systemd
```

如使用 standalone 输出，需要确保静态资源存在：

```bash
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
```

## 4. Nginx 反向代理

创建 `/etc/nginx/conf.d/ai-learning-h5.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

## 5. 定时聚合新闻

使用 crontab 每天 07:10 执行：

```bash
crontab -e
```

加入：

```cron
10 7 * * * cd /opt/ai-learning-h5 && /usr/bin/pnpm ingest:news >> /var/log/ai-learning-news.log 2>&1
```

也可以用 PM2 cron：

```bash
pm2 start "pnpm ingest:news" --name ai-learning-news --cron "10 7 * * *" --no-autorestart
pm2 save
```

## 6. 发布更新

```bash
cd /opt/ai-learning-h5
git pull
pnpm install --frozen-lockfile
pnpm build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
pm2 restart ai-learning-h5
```
