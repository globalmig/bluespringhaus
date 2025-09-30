import { NextApiRequest, NextApiResponse } from "next";
import { KakaoTokenResponse } from "../../../types/kakao";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token" });
    }

    const newTokens = await refreshKakaoToken(refreshToken);

    // 새 토큰으로 쿠키 업데이트
    const cookies = [`access_token=${newTokens.access_token}; HttpOnly; Path=/; Max-Age=${newTokens.expires_in}`];

    if (newTokens.refresh_token) {
      cookies.push(`refresh_token=${newTokens.refresh_token}; HttpOnly; Path=/; Max-Age=${newTokens.refresh_token_expires_in}`);
    }

    res.setHeader("Set-Cookie", cookies);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("토큰 갱신 중 오류:", error);
    res.status(401).json({ error: "Token refresh failed" });
  }
}

async function refreshKakaoToken(refreshToken: string): Promise<KakaoTokenResponse> {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("client_id", process.env.KAKAO_REST_API_KEY!);
  params.append("refresh_token", refreshToken);

  if (process.env.KAKAO_CLIENT_SECRET) {
    params.append("client_secret", process.env.KAKAO_CLIENT_SECRET);
  }

  const response = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`토큰 갱신 실패: ${response.status}`);
  }

  return response.json();
}
