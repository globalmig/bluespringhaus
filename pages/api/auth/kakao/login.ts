import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("=== 카카오 로그인 API 시작 ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

  console.log("REST_API_KEY:", REST_API_KEY ? "설정됨" : "없음");
  console.log("REDIRECT_URI:", REDIRECT_URI);

  if (!REST_API_KEY || !REDIRECT_URI) {
    return res.status(500).json({ error: "환경변수가 설정되지 않았습니다." });
  }

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=profile_nickname,profile_image,account_email`;

  console.log("리다이렉트 URL:", kakaoURL);

  res.redirect(302, kakaoURL);
}
