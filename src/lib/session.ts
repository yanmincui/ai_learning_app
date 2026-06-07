import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE_NAME = "ai_learning_session";
export const WECHAT_STATE_COOKIE_NAME = "ai_learning_wx_state";

export type AuthSession = {
  userId: string;
  provider: "wechat";
  openid: string;
  unionid?: string;
  nickname?: string;
  avatarUrl?: string;
  issuedAt: number;
};

export type OAuthState = {
  nonce: string;
  returnTo: string;
  issuedAt: number;
};

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function getSessionMaxAgeSeconds() {
  return SESSION_MAX_AGE_SECONDS;
}

export function createSignedToken(payload: AuthSession | OAuthState, secret = getAuthSecret()) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function verifySignedToken<T>(token: string | undefined, secret = getAuthSecret()): T | null {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload, secret);
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    return JSON.parse(fromBase64Url(encodedPayload)) as T;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: Request) {
  const cookies = parseCookieHeader(request.headers.get("cookie"));
  return verifySignedToken<AuthSession>(cookies[AUTH_COOKIE_NAME]);
}

export function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.WECHAT_SESSION_SECRET || "dev-ai-learning-session-secret";
}

function parseCookieHeader(header: string | null) {
  return Object.fromEntries(
    (header ?? "")
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf("=");
        if (index === -1) {
          return [item, ""];
        }

        return [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
      })
  );
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}
