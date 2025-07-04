import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const supabase = createPagesServerClient({ req, res });

    // 예시: 로그인한 사용자 이메일을 프로필에 upsert
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("로그인 정보 조회 실패:", userError);
      return res.status(401).json({ success: false, error: "로그인이 필요합니다." });
    }

    const { email } = user;
    const { error: upsertError } = await supabase.from("profiles").upsert([{ id: user.id, email }], { onConflict: "id" });

    if (upsertError) {
      console.error("프로필 upsert 실패:", upsertError);
      return res.status(500).json({ success: false, error: "프로필 저장 실패" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("API 처리 중 오류:", error);
    return res.status(500).json({ success: false, error: "서버 오류가 발생했습니다." });
  }
}
