import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  buildWechatAuthorizeUrl,
  getAuthCallbackUrl,
  getWechatConfig
} from "@/lib/wechat-auth";
import {
  createSignedToken,
  WECHAT_STATE_COOKIE_NAME
} from "@/lib/session";

export async function GET(request: Request) {
  const config = getWechatConfig();

  if (!config) {
    return NextResponse.json({ error: "Wechat login is not configured" }, { status: 501 });
  }

  const requestUrl = new URL(request.url);
  const returnTo = normalizeReturnTo(requestUrl.searchParams.get("returnTo"));
  const state = createSignedToken({
    nonce: randomUUID(),
    returnTo,
    issuedAt: Date.now()
  });

  const cookieStore = await cookies();
  cookieStore.set(WECHAT_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600
  });

  return NextResponse.redirect(buildWechatAuthorizeUrl(config, getAuthCallbackUrl(), state));
}

function normalizeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
  if (basePath && value.startsWith(`${basePath}/`)) {
    return value.slice(basePath.length) || "/";
  }

  if (basePath && value === basePath) {
    return "/";
  }

  return value;
}
