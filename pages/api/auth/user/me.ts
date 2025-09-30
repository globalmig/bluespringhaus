import { KakaoUserInfo } from "@/types/kakao";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // 카카오 API로 사용자 정보 조회
    const response = await fetch("https://kapi.kakao.com/v2/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // 토큰이 만료된 경우 리프레시 시도
        return res.status(401).json({ error: "Token expired" });
      }
      throw new Error(`사용자 정보 조회 실패: ${response.status}`);
    }

    const userInfo: KakaoUserInfo = await response.json();
    res.status(200).json(userInfo);
  } catch (error) {
    console.error("사용자 정보 조회 중 오류:", error);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
}
