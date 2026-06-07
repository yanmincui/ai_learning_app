import { afterEach, describe, expect, it, vi } from "vitest";
import { createSignedToken, verifySignedToken } from "@/lib/session";
import {
  buildWechatAuthorizeUrl,
  getAuthCallbackUrl,
  getUserIdFromWechat,
  getWechatConfig
} from "@/lib/wechat-auth";
import type { AuthSession } from "@/lib/session";

const originalEnv = { ...process.env };

afterEach(() => {
  vi.unstubAllEnvs();
  process.env = { ...originalEnv };
});

describe("wechat auth helpers", () => {
  it("signs and verifies auth sessions", () => {
    const session: AuthSession = {
      userId: "wx-openid-1",
      provider: "wechat",
      openid: "openid-1",
      issuedAt: Date.now()
    };
    const token = createSignedToken(session, "test-secret");

    expect(verifySignedToken<AuthSession>(token, "test-secret")).toMatchObject({ userId: "wx-openid-1" });
    expect(verifySignedToken<AuthSession>(`${token}x`, "test-secret")).toBeNull();
  });

  it("builds official-account oauth urls", () => {
    const url = buildWechatAuthorizeUrl(
      {
        appId: "appid",
        appSecret: "secret",
        scope: "snsapi_userinfo",
        mode: "mp"
      },
      "https://ian.today/ai-learning/api/auth/wechat/callback/",
      "state-1"
    );

    expect(url).toContain("https://open.weixin.qq.com/connect/oauth2/authorize");
    expect(url).toContain("scope=snsapi_userinfo");
    expect(url).toContain("#wechat_redirect");
  });

  it("reads config and callback from env", () => {
    vi.stubEnv("WECHAT_APP_ID", "appid");
    vi.stubEnv("WECHAT_APP_SECRET", "secret");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://ian.today/ai-learning");

    expect(getWechatConfig()).toMatchObject({ appId: "appid", mode: "mp" });
    expect(getAuthCallbackUrl()).toBe("https://ian.today/ai-learning/api/auth/wechat/callback/");
  });

  it("prefers unionid for stable user ids", () => {
    expect(getUserIdFromWechat({ openid: "openid", unionid: "unionid" })).toBe("wx-unionid");
    expect(getUserIdFromWechat({ openid: "openid" })).toBe("wx-openid");
  });
});
