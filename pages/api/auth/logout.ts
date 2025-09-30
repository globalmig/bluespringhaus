import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const accessToken = req.cookies.access_token;

    if (accessToken) {
      // 카카오 로그아웃 API 호출
      await fetch("https://kapi.kakao.com/v1/user/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
    }

    // 쿠키 삭제
    res.setHeader("Set-Cookie", ["access_token=; HttpOnly; Path=/; Max-Age=0", "refresh_token=; HttpOnly; Path=/; Max-Age=0", "user_id=; HttpOnly; Path=/; Max-Age=0"]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("로그아웃 중 오류:", error);
    res.status(500).json({ error: "Logout failed" });
  }
}
