// pages/api/inquiry/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"; // Supabase 세션 확인용
import { getServerSession } from "next-auth/next"; // NextAuth(카카오) 세션 확인용
import { authOptions } from "../auth/[...nextauth]"; // 경로 프로젝트에 맞추세요
import { createClient } from "@supabase/supabase-js"; // service-role 클라이언트

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET only" });
  }

  // 0) ENV 가드
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Server env missing (SUPABASE_URL or SERVICE_ROLE_KEY)" });
  }

  // 1) 두 체계의 로그인 상태 확인 (둘 중 하나만 OK)
  const supa = createPagesServerClient({ req, res });
  const { data: { user: supaUser } = { user: null } } = await supa.auth.getUser().catch(() => ({ data: { user: null } as any }));

  const nextSession = await getServerSession(req, res, authOptions).catch(() => null);
  const kakaoEmail = (nextSession?.user as any)?.email ?? null;

  if (!supaUser && !kakaoEmail) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  // 2) 내부 UUID(profile.id) 확보 (service-role로 안전 조회)
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

  let internalUserId: string | null = null;

  if (supaUser?.id) {
    // Supabase 로그인: profiles.id = supaUser.id (또는 이메일 매칭) 시도
    const { data: byId } = await admin.from("profiles").select("id").eq("id", supaUser.id).maybeSingle();
    if (byId?.id) {
      internalUserId = byId.id;
    } else if (supaUser.email) {
      const { data: byEmail } = await admin.from("profiles").select("id").eq("email", supaUser.email).maybeSingle();
      if (byEmail?.id) internalUserId = byEmail.id;
    }
  } else if (kakaoEmail) {
    // 카카오 로그인: 이메일로 profiles 조회
    const { data: byEmail } = await admin.from("profiles").select("id").eq("email", kakaoEmail).maybeSingle();
    if (byEmail?.id) internalUserId = byEmail.id;
  }

  if (!internalUserId) {
    // 아직 프로필이 없으면 클라에서 /api/user/sync 호출 후 재시도하게 409 반환
    return res.status(409).json({ error: "PROFILE_SYNC_REQUIRED" });
  }

  // 3) 내 데이터만 강제 필터해서 조회 (service-role → RLS 우회)
  const [speakerResult, artistResult] = await Promise.all([
    admin.from("inquiries").select(`*, speakers ( id, name, profile_image, short_desc, tags )`).eq("user_id", internalUserId).order("created_at", { ascending: false }),
    admin.from("inquiries_artist").select(`*, artists ( id, name, profile_image, short_desc, tags )`).eq("user_id", internalUserId).order("created_at", { ascending: false }),
  ]);

  if (speakerResult.error || artistResult.error) {
    const err = speakerResult.error || artistResult.error;
    if (process.env.NODE_ENV !== "production") console.error("DB_QUERY_FAILED:", err);
    return res.status(500).json({ error: "DB_QUERY_FAILED" });
  }

  return res.status(200).json({
    inquiries: speakerResult.data,
    artistInquiries: artistResult.data,
  });
}
