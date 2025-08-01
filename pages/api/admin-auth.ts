import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const referer = req.headers.referer || ""; // 요청 보낸 페이지 경로

  // ✅ /manager 페이지에서 호출됐으면 통과 (우회 조건)
  if (referer.includes("/manager")) {
    return res.status(200).json({ ok: true, bypass: true });
  }

  // ✅ 평소대로 비밀번호 체크
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    return res.status(200).json({ ok: true });
  } else {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
}
