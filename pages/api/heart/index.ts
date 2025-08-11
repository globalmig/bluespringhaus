// pages/api/heart/heart.ts
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });
  const { targetId } = req.query;

  // 로그인 여부 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
  }
  if (!targetId || typeof targetId !== "string") {
    return res.status(400).json({ ok: false, error: "유효하지 않은 targetId" });
  }

  if (req.method === "GET") {
    // 기존 찜 여부 확인
    const { data: existing, error: findError } = await supabase.from("user_likes").select("id").eq("user_id", user.id).eq("target_id", targetId).maybeSingle();

    if (findError) {
      console.error("DB 조회 실패:", findError);
      return res.status(500).json({ ok: false, error: "DB 조회 실패" });
    }

    return res.status(200).json({ ok: true, liked: !!existing });
  }

  if (req.method === "POST") {
    const { data: existing, error: findError } = await supabase.from("user_likes").select("id").eq("user_id", user.id).eq("target_id", targetId).maybeSingle();

    if (findError) {
      console.error("DB 조회 실패:", findError);
      return res.status(500).json({ ok: false, error: "DB 조회 실패" });
    }

    if (existing) {
      // 찜 해제
      const { error: delError } = await supabase.from("user_likes").delete().eq("id", existing.id).eq("user_id", user.id);

      if (delError) {
        console.error("찜 해제 실패:", delError);
        return res.status(500).json({ ok: false, error: "찜 해제 실패" });
      }
      return res.status(200).json({ ok: true, liked: false });
    } else {
      // 찜 추가
      const { error: insertError } = await supabase.from("user_likes").insert({
        user_id: user.id,
        target_id: targetId,
      });

      if (insertError) {
        console.error("찜 추가 실패:", insertError);
        return res.status(500).json({ ok: false, error: "찜 추가 실패" });
      }
      return res.status(200).json({ ok: true, liked: true });
    }
  }

  // 허용되지 않은 메서드
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
