// pages/api/review.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const supabase = createPagesServerClient({ req, res });
  const { rating, comment, speaker_id } = req.body;

  if (!rating || !comment || !speaker_id) {
    return res.status(400).json({ success: false, error: "필수 정보가 누락되었습니다." });
  }

  console.log("📍 POST 요청 도착");

  // ✅ 로그인된 유저 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("📍 인증 정보 확인:", user);
  console.log("📍 인증 에러:", userError);

  if (userError || !user) {
    return res.status(401).json({ success: false, error: "로그인이 필요합니다." });
  }

  // ✅ inquiries에서 status 확인
  const { data: inquiries, error: inquiryError } = await supabase.from("inquiries").select("*").eq("user_id", user.id).eq("speaker_id", speaker_id).eq("status", "accepted");

  if (inquiryError) {
    console.error("inquiry fetch 실패:", inquiryError);
    return res.status(500).json({ success: false, error: "섭외 정보 확인 실패" });
  }

  if (!inquiries || inquiries.length === 0) {
    return res.status(403).json({
      success: false,
      error: "섭외가 수락된 사용자만 리뷰를 작성할 수 있습니다.",
    });
  }

  const reviewer_name = user.user_metadata?.name?.trim() || "익명";

  const { error } = await supabase.from("reviews").insert([
    {
      rating,
      comment,
      speaker_id,
      reviewer_name,
      user_id: user.id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("리뷰 작성 실패:", error);
    return res.status(500).json({ success: false, error: "리뷰 등록 실패" });
  }

  return res.status(200).json({ success: true });
}
