// pages/api/user/sync.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "POST only" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const u: any = session?.user; // { email, name, image, provider: 'kakao', uid: '4460962190' }
    if (!u?.email) return res.status(401).json({ success: false, error: "로그인이 필요합니다." });

    // service-role (서버 전용)
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

    const payload = {
      email: u.email,
      name: u.name ?? null,
      avatar_url: u.image ?? null,
      provider: (u as any).provider ?? "kakao",
      external_id: (u as any).uid ?? (u as any).id ?? null,
    };

    // 이메일로 통합(권장) — profiles(email unique)
    const { data, error } = await admin.from("profiles").upsert(payload, { onConflict: "email" }).select("id").single();

    if (error) {
      console.error("profiles upsert 실패:", error);
      return res.status(500).json({ success: false, error: "프로필 저장 실패" });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (e) {
    console.error("user/sync 예외:", e);
    return res.status(500).json({ success: false, error: "서버 오류" });
  }
}
