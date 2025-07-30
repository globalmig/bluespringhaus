import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { inquiryId, action, token, reason, target } = req.method === "POST" ? req.body : req.query;

  if (!inquiryId || !action || !token) {
    return res.status(400).json({ success: false, message: "필수 정보 누락" });
  }

  const supabase = createPagesServerClient({ req, res });

  const table = target === "artist" ? "inquiries_artist" : "inquiries";

  const { data: inquiry, error } = await supabase.from(table).select("token").eq("id", inquiryId).single();

  if (error || !inquiry) {
    return res.status(404).json({ success: false, message: "문의 정보 없음" });
  }

  if (inquiry.token !== token) {
    return res.status(401).json({ success: false, message: "유효하지 않은 토큰" });
  }

  if (action === "reject") {
    if (!reason) return res.status(400).json({ success: false, message: "거절 사유가 필요합니다." });
    await supabase.from(table).update({ status: "rejected", reason }).eq("id", inquiryId);
  } else if (action === "accept") {
    await supabase.from(table).update({ status: "accepted" }).eq("id", inquiryId);
  } else {
    return res.status(400).json({ success: false, message: "유효하지 않은 action" });
  }

  return res.status(200).json({ success: true });
}
