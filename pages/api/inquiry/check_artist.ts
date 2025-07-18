// pages/api/inquiry/check_artist.ts
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ canApply: false, error: "GET 메소드만 허용됩니다." });
  }

  try {
    const supabase = createPagesServerClient({ req, res });
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({ canApply: false, error: "로그인이 필요합니다." });
    }

    const artistId = req.query.artistId;

    if (!artistId || typeof artistId !== "string") {
      return res.status(400).json({ canApply: false, error: "유효하지 않은 artistId" });
    }

    const { data: existing, error: findError } = await supabase
      .from("inquiries_artist")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("artist_id", artistId)
      .eq("status", "in_progress")
      .maybeSingle();

    if (findError) {
      console.error("❌ Supabase 쿼리 에러:", findError);
      return res.status(500).json({ canApply: false, error: "DB 조회 실패" });
    }

    if (existing && existing.status === "in_progress") {
      return res.status(403).json({ canApply: false, reason: "이미 진행 중인 문의가 있습니다." });
    }

    return res.status(200).json({ canApply: true, message: "문의 가능" });
  } catch (e) {
    console.error("🔥 처리 중 예외 발생:", e);
    return res.status(500).json({ canApply: false, error: "서버 내부 오류" });
  }
}
