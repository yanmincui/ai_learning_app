import { NextResponse } from "next/server";
import { canUseWechatLogin } from "@/lib/wechat-auth";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);

  return NextResponse.json({
    canUseWechatLogin: canUseWechatLogin(),
    user: session
      ? {
          userId: session.userId,
          provider: session.provider,
          nickname: session.nickname,
          avatarUrl: session.avatarUrl
        }
      : null
  });
}
