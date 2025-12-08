// pages/api/inquiry/admin.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET only" });
  }

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  // ENV 가드
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Server env missing (SUPABASE_URL or SERVICE_ROLE_KEY)" });
  }

  // service-role 클라이언트로 RLS 우회하여 전체 데이터 조회
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

  try {
    // 전체 데이터 조회 (user_id 필터 없음)
    const [speakerResult, artistResult] = await Promise.all([
      admin
        .from("inquiries")
        .select(
          `
          *,
          speakers ( id, name, profile_image, short_desc, tags ),
          profiles ( email, name )
        `
        )
        .order("created_at", { ascending: false }),

      admin
        .from("inquiries_artist")
        .select(
          `
          *,
          artists ( id, name, profile_image, short_desc, tags ),
          profiles ( email, name )
        `
        )
        .order("created_at", { ascending: false }),
    ]);

    if (speakerResult.error || artistResult.error) {
      const err = speakerResult.error || artistResult.error;
      console.error("DB_QUERY_FAILED:", err);
      return res.status(500).json({ error: "DB_QUERY_FAILED", details: err });
    }

    return res.status(200).json({
      inquiries: speakerResult.data,
      artistInquiries: artistResult.data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
