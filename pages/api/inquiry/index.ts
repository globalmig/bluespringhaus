import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET 메소드만 허용됩니다." });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("🔑 전달받은 토큰:", token);

    if (!token) {
      // console.error("❌ 토큰이 없습니다.");
      return res.status(401).json({ error: "토큰이 필요합니다." });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    // console.log("🙋‍♂️ 인증된 유저:", user);
    // console.log("❌ 유저 인증 에러:", userError);

    if (userError || !user) {
      // console.error("❌ 유저 인증 실패");
      return res.status(401).json({ error: "유효하지 않은 토큰" });
    }

    const { data: inquiries, error } = await supabase
      .from("inquiries")
      .select(
        `
    *,
    speakers ( id, name, profile_image, short_desc, tags )
  `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // console.log("📄 문의 조회 결과:", inquiries);
    // console.log("❌ DB 조회 에러:", error);

    if (error) {
      // console.error("❌ DB 조회 실패:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ inquiries });
  } catch (e) {
    // console.error("🔥 API 처리 중 예외 발생:", e);
    return res.status(500).json({ error: "서버 내부 오류" });
  }
}
