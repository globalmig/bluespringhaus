import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, error: "유효하지 않은 리뷰 ID입니다." });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return res.status(401).json({ success: false, error: "로그인이 필요합니다." });

  const { data: review, error: reviewError } = await supabase.from("reviews_artist").select("*").eq("id", id).eq("user_id", user.id).maybeSingle();

  if (reviewError || !review) {
    return res.status(404).json({ success: false, error: "리뷰를 찾을 수 없거나 수정 권한이 없습니다." });
  }

  // 수정
  if (req.method === "PUT") {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, error: "별점과 리뷰 내용을 모두 입력해주세요." });
    }
    // console.log("🟡 리뷰 수정 요청 도착:", { id, rating, comment, user_id: user.id });
    const { error: updateError, data: updateResult } = await supabase
      .from("reviews_artist")
      .update({
        rating,
        comment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    // console.log("🟢 Supabase 수정 결과:", { updateResult, updateError });

    if (updateError) return res.status(500).json({ success: false, error: "리뷰 수정 실패" });

    const { data: updatedReviews, error: fetchError } = await supabase.from("reviews_artist").select("*").eq("artist_id", review.artist_id).order("created_at", { ascending: false });

    if (fetchError) return res.status(500).json({ success: false, error: "리뷰 목록 갱신 실패" });

    return res.status(200).json({ success: true, reviews: updatedReviews });
  }

  // 삭제
  if (req.method === "DELETE") {
    const { error: deleteError } = await supabase.from("reviews_artist").delete().eq("id", id).eq("user_id", user.id);
    if (deleteError) return res.status(500).json({ success: false, error: "리뷰 삭제 실패" });

    const { data: updatedReviews, error: fetchError } = await supabase.from("reviews_artist").select("*").eq("artist_id", review.artist_id).order("created_at", { ascending: false });

    if (fetchError) return res.status(500).json({ success: false, error: "리뷰 목록 갱신 실패" });

    return res.status(200).json({ success: true, reviews: updatedReviews });
  }

  return res.status(405).json({ success: false, error: "허용되지 않은 메소드입니다." });
}
