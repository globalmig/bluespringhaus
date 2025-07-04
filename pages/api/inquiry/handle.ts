import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { inquiryId, action, token } = req.query;

  if (!inquiryId || !action || !token) {
    return res.status(400).send("필수 정보 누락");
  }

  const supabase = createPagesServerClient({ req, res });
  const { data: inquiry, error } = await supabase.from("inquiries").select("token").eq("id", inquiryId).single();

  if (error || !inquiry) return res.status(404).send("문의 정보 없음");

  if (inquiry.token !== token) return res.status(401).send("유효하지 않은 토큰");

  const status = action === "accept" ? "accepted" : "rejected";
  await supabase.from("inquiries").update({ status }).eq("id", inquiryId);

  return res.status(200).send(`문의가 ${status} 처리되었습니다.`);
}
