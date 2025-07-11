import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET 메소드만 허용됩니다." });
  }

  const supabase = createPagesServerClient({ req, res });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  try {
    const [speakerResult, artistResult] = await Promise.all([
      supabase.from("inquiries").select(`*, speakers ( id, name, profile_image, short_desc, tags )`).eq("user_id", user.id).order("created_at", { ascending: false }),

      supabase.from("inquiries_artist").select(`*, artists ( id, name, profile_image, short_desc, tags )`).eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);

    if (speakerResult.error || artistResult.error) {
      throw speakerResult.error || artistResult.error;
    }

    return res.status(200).json({
      inquiries: speakerResult.data,
      artistInquiries: artistResult.data,
    });
  } catch (e: any) {
    console.error("❌ DB 조회 실패:", e);
    return res.status(500).json({ error: "문의 내역을 불러오지 못했습니다." });
  }
}
