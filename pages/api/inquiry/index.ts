import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET 메소드만 허용됩니다." });
  }

  // ✅ 이게 쿠키에서 토큰 꺼내서 알아서 인증
  const supabase = createPagesServerClient({ req, res });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select(`*, speakers ( id, name, profile_image, short_desc, tags )`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ inquiries });
}
