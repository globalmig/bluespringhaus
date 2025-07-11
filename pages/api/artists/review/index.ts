import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  const supabase = createPagesServerClient({ req, res });
  const { rating, comment, artist_id } = req.body;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return res.status(401).json({ success: false, error: "로그인이 필요합니다." });

  if (!rating || !comment || !artist_id) {
    return res.status(400).json({ success: false, error: "모든 항목을 입력해주세요." });
  }

  const { error: insertError } = await supabase.from("reviews_artist").insert({
    rating,
    comment,
    artist_id,
    user_id: user.id,
    reviewer_name: user.email ?? "익명",
  });

  if (insertError) return res.status(500).json({ success: false, error: "리뷰 등록 실패" });

  const { data: reviews, error: fetchError } = await supabase.from("reviews_artist").select("*").eq("artist_id", artist_id).order("created_at", { ascending: false });

  if (fetchError) return res.status(500).json({ success: false, error: "리뷰 목록 갱신 실패" });

  return res.status(200).json({ success: true, reviews });
}
