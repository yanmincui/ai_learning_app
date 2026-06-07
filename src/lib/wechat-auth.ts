import { createSupabaseServerClient } from "./supabase";
import type { AuthSession } from "./session";

export type WechatOAuthMode = "mp" | "open";

export type WechatConfig = {
  appId: string;
  appSecret: string;
  scope: "snsapi_base" | "snsapi_userinfo" | "snsapi_login";
  mode: WechatOAuthMode;
};

export type WechatTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
  unionid?: string;
};

export type WechatProfile = {
  openid: string;
  unionid?: string;
  nickname?: string;
  headimgurl?: string;
};

type WechatError = {
  errcode?: number;
  errmsg?: string;
};

export function getWechatConfig(): WechatConfig | null {
  const appId = process.env.WECHAT_APP_ID;
  const appSecret = process.env.WECHAT_APP_SECRET;

  if (!appId || !appSecret) {
    return null;
  }

  const mode = process.env.WECHAT_OAUTH_MODE === "open" ? "open" : "mp";
  const defaultScope = mode === "open" ? "snsapi_login" : "snsapi_userinfo";
  const scope = (process.env.WECHAT_OAUTH_SCOPE || defaultScope) as WechatConfig["scope"];

  return { appId, appSecret, scope, mode };
}

export function canUseWechatLogin() {
  return Boolean(getWechatConfig());
}

export function buildWechatAuthorizeUrl(config: WechatConfig, redirectUri: string, state: string) {
  const endpoint =
    config.mode === "open"
      ? "https://open.weixin.qq.com/connect/qrconnect"
      : "https://open.weixin.qq.com/connect/oauth2/authorize";
  const params = new URLSearchParams({
    appid: config.appId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: config.scope,
    state
  });

  return `${endpoint}?${params.toString()}#wechat_redirect`;
}

export function getAuthCallbackUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000";
  return `${appUrl.replace(/\/$/, "")}/api/auth/wechat/callback/`;
}

export function getUserIdFromWechat(profile: Pick<WechatProfile, "openid" | "unionid">) {
  return `wx-${profile.unionid || profile.openid}`;
}

export async function exchangeWechatCode(code: string, config: WechatConfig): Promise<WechatTokenResponse> {
  const url = new URL("https://api.weixin.qq.com/sns/oauth2/access_token");
  url.searchParams.set("appid", config.appId);
  url.searchParams.set("secret", config.appSecret);
  url.searchParams.set("code", code);
  url.searchParams.set("grant_type", "authorization_code");

  const response = await fetch(url);
  const payload = (await response.json()) as WechatTokenResponse & WechatError;

  if (!response.ok || payload.errcode) {
    throw new Error(payload.errmsg || "Wechat code exchange failed");
  }

  return payload;
}

export async function fetchWechatProfile(token: WechatTokenResponse): Promise<WechatProfile> {
  if (!token.scope.includes("snsapi_userinfo") && !token.scope.includes("snsapi_login")) {
    return {
      openid: token.openid,
      unionid: token.unionid
    };
  }

  const url = new URL("https://api.weixin.qq.com/sns/userinfo");
  url.searchParams.set("access_token", token.access_token);
  url.searchParams.set("openid", token.openid);
  url.searchParams.set("lang", "zh_CN");

  const response = await fetch(url);
  const payload = (await response.json()) as WechatProfile & WechatError;

  if (!response.ok || payload.errcode) {
    throw new Error(payload.errmsg || "Wechat profile fetch failed");
  }

  return payload;
}

export async function saveWechatUser(session: AuthSession) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return;
  }

  const { error } = await supabase.from("wechat_users").upsert(
    {
      user_id: session.userId,
      openid: session.openid,
      unionid: session.unionid ?? null,
      nickname: session.nickname ?? null,
      avatar_url: session.avatarUrl ?? null,
      last_login_at: new Date().toISOString()
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}
