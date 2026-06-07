# 微信登录最小方案

本项目使用微信 OAuth2 做 H5 登录，登录成功后用服务端签名 Cookie 维持会话，并把学习进度写入 `user_progress`。

## 1. 微信后台配置

适合在微信内打开的 H5，使用公众号网页授权：

```text
授权回调域名：ian.today
```

应用内实际回调地址由代码生成：

```text
https://ian.today/ai-learning/api/auth/wechat/callback/
```

如果使用开放平台网站应用扫码登录，把 `WECHAT_OAUTH_MODE` 改为 `open`，并在开放平台配置对应回调域名。

## 2. GitHub Secret / VPS_ENV

在 `VPS_ENV` 里增加：

```text
AUTH_SECRET=请换成至少32位随机字符串
WECHAT_APP_ID=你的微信公众号AppID
WECHAT_APP_SECRET=你的微信公众号AppSecret
WECHAT_OAUTH_MODE=mp
WECHAT_OAUTH_SCOPE=snsapi_userinfo
```

原有子路径配置保持：

```text
NEXT_PUBLIC_APP_URL=https://ian.today/ai-learning
NEXT_PUBLIC_BASE_PATH=/ai-learning
```

## 3. Supabase 表

在 Supabase SQL Editor 执行或更新：

```text
docs/supabase-schema.sql
```

新增的 `wechat_users` 表用于保存微信用户最小资料：

```text
user_id, openid, unionid, nickname, avatar_url, last_login_at
```

学习记录继续写入：

```text
user_progress
```

登录后服务端会优先使用 Cookie 中的微信 `user_id`，不会信任前端传来的 guest id。

## 4. 用户体验

- 未登录：学习记录保存在浏览器本地。
- 微信登录后：本地记录与云端记录合并，并同步到 Supabase。
- 退出登录：只清除登录 Cookie，不清除浏览器本地学习缓存。
