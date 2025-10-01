// pages/api/inquiry/check.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // 경로는 프로젝트에 맞게 조정

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ canApply: false, error: "GET 메소드만 허용됩니다." });
  }

  try {
    // 0) 파라미터 체크
    const speakerId = req.query.speakerId as string;
    if (!speakerId) {
      return res.status(400).json({ canApply: false, error: "유효하지 않은 speakerId" });
    }

    // 1) 두 체계의 세션을 모두 확인
    const supabase = createPagesServerClient({ req, res });
    const {
      data: { user: supaUser },
    } = await supabase.auth.getUser();

    const session = await getServerSession(req, res, authOptions);
    const nextUser = session?.user as any | undefined;

    if (!supaUser && !nextUser) {
      return res.status(401).json({ canApply: false, error: "로그인이 필요합니다." });
    }

    // 2) 내부 조회에 사용할 UUID 확보
    //    - Supabase 로그인: auth.users.id 를 그대로 사용 (UUID)
    //    - 카카오 로그인: 이메일로 profiles.id(=UUID) 조회하여 매핑
    let internalUserId: string | null = null;

    if (supaUser?.id) {
      internalUserId = supaUser.id; // 이미 UUID
    } else if (nextUser) {
      const email: string | undefined = nextUser.email;
      if (!email) {
        return res.status(401).json({ canApply: false, error: "이메일 권한 동의가 필요합니다." });
      }

      // 서버 전용 Supabase 클라이언트 (RLS 우회)
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // 절대 클라이언트로 노출 금지
        { auth: { persistSession: false } }
      );

      // NOTE: profiles 테이블에 email -> id(UUID) 매핑이 존재해야 함
      const { data: profile, error: profileErr } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();

      if (profileErr) {
        console.error("❌ profiles 조회 에러:", profileErr);
        return res.status(500).json({ canApply: false, error: "프로필 조회 실패" });
      }

      if (!profile?.id) {
        // 아직 우리 DB에 프로필이 없다면 동기화 필요
        return res.status(409).json({
          canApply: false,
          error: "프로필 동기화가 필요합니다.",
          requiresSync: true,
        });
      }

      internalUserId = profile.id; // UUID 확보 완료
    }

    if (!internalUserId) {
      return res.status(401).json({ canApply: false, error: "유효하지 않은 세션" });
    }

    // 3) 진행 중(in_progress) 섭외 있는지 확인 (UUID로 조회)
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

    const { data: existing, error: findError } = await admin
      .from("inquiries")
      .select("id, status")
      .eq("user_id", internalUserId) // ✅ uuid로 비교
      .eq("speaker_id", speakerId)
      .eq("status", "in_progress")
      .maybeSingle();

    if (findError) {
      console.error("❌ Supabase 조회 에러:", findError);
      return res.status(500).json({ canApply: false, error: "DB 조회 실패" });
    }

    if (existing?.status === "in_progress") {
      return res.status(403).json({ canApply: false, reason: "이미 진행 중인 섭외가 있습니다." });
    }

    return res.status(200).json({ canApply: true, message: "섭외 가능" });
  } catch (e) {
    console.error("🔥 처리 중 예외 발생:", e);
    return res.status(500).json({ canApply: false, error: "서버 내부 오류" });
  }
}
