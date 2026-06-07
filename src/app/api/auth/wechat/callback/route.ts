import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  exchangeWechatCode,
  fetchWechatProfile,
  getUserIdFromWechat,
  getWechatConfig,
  saveWechatUser
} from "@/lib/wechat-auth";
import {
  AUTH_COOKIE_NAME,
  createSignedToken,
  getSessionMaxAgeSeconds,
  verifySignedToken,
  WECHAT_STATE_COOKIE_NAME
} from "@/lib/session";
import type { OAuthState } from "@/lib/session";

export async function GET(request: Request) {
  const config = getWechatConfig();
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");

  if (!config) {
    return redirectWithError(requestUrl, "wechat_not_configured");
  }

  if (!code || !state) {
    return redirectWithError(requestUrl, "missing_code");
  }

  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(WECHAT_STATE_COOKIE_NAME)?.value;
  const parsedState = verifySignedToken<OAuthState>(state);

  cookieStore.delete(WECHAT_STATE_COOKIE_NAME);

  if (!parsedState || state !== stateCookie || Date.now() - parsedState.issuedAt > 10 * 60_000) {
    return redirectWithError(requestUrl, "invalid_state");
  }

  try {
    const token = await exchangeWechatCode(code, config);
    const profile = await fetchWechatProfile(token);
    const session = {
      userId: getUserIdFromWechat(profile),
      provider: "wechat" as const,
      openid: profile.openid,
      unionid: profile.unionid,
      nickname: profile.nickname,
      avatarUrl: profile.headimgurl,
      issuedAt: Date.now()
    };

    await saveWechatUser(session);

    cookieStore.set(AUTH_COOKIE_NAME, createSignedToken(session), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getSessionMaxAgeSeconds()
    });

    return NextResponse.redirect(getReturnUrl(requestUrl, parsedState.returnTo));
  } catch (error) {
    return redirectWithError(requestUrl, error instanceof Error ? error.message : "wechat_login_failed");
  }
}

function redirectWithError(requestUrl: URL, error: string) {
  const url = getReturnUrl(requestUrl, "/");
  url.searchParams.set("auth_error", error);
  return NextResponse.redirect(url);
}

function getReturnUrl(requestUrl: URL, returnTo: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (appUrl) {
    return new URL(returnTo.replace(/^\//, ""), `${appUrl.replace(/\/$/, "")}/`);
  }

  return new URL(returnTo, requestUrl.origin);
}
