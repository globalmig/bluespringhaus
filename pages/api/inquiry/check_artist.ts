// pages/api/inquiry/check.ts
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET 메소드만 허용됩니다." });
  }

  try {
    const supabase = createPagesServerClient({ req, res });
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({ error: "로그인이 필요합니다." });
    }

    const artistId = req.query.artistId;

    if (!artistId || typeof artistId !== "string") {
      return res.status(400).json({ error: "유효하지 않은 artistId" });
    }

    const { data: existing, error: findError } = await supabase
      .from("inquiries_artist")
      .select("id")
      .eq("user_id", user.id)
      .eq("artist_id", artistId)
      .not("status", "in", "(accepted,rejected)")
      .maybeSingle();

    if (findError) {
      console.error("❌ Supabase 쿼리 에러:", findError);
      return res.status(500).json({ error: "DB 조회 실패" });
    }

    if (existing) {
      return res.status(403).json({ error: "이미 처리 중인 문의가 있습니다." });
    }

    return res.status(200).json({ message: "문의 가능" });
  } catch (e) {
    console.error("🔥 처리 중 예외 발생:", e);
    return res.status(500).json({ error: "서버 내부 오류" });
  }
}
