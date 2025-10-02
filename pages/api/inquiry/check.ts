// pages/api/inquiry/check.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 🔒 절대 캐시 금지
  res.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "GET") {
    return res.status(405).json({ canApply: false, error: "GET 메소드만 허용됩니다." });
  }

  // 0) 파라미터 체크
  const speakerId = req.query.speakerId as string | undefined;
  if (!speakerId) {
    return res.status(400).json({ canApply: false, error: "유효하지 않은 speakerId" });
  }

  // 1) ENV 가드
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ canApply: false, error: "서버 환경변수 누락(Supabase URL/Service role key)" });
  }

  try {
    // 2) 두 체계의 세션 확인
    const supabase = createPagesServerClient({ req, res });
    const { data: { user: supaUser } = { user: null } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } } as any));

    const session = await getServerSession(req, res, authOptions).catch(() => null);
    const nextUser = session?.user as any | undefined;

    if (!supaUser && !nextUser) {
      return res.status(401).json({ canApply: false, error: "로그인이 필요합니다." });
    }

    // 3) 내부 UUID(profiles.id) 확보
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

    let internalUserId: string | null = null;

    if (supaUser?.id) {
      // (A) Supabase 로그인: profiles에서 매핑 시도 (id 또는 보조컬럼/supabase_user_id, fallback 이메일)
      const { data: byId } = await admin.from("profiles").select("id").eq("id", supaUser.id).maybeSingle();
      if (byId?.id) {
        internalUserId = byId.id;
      } else if ((supaUser as any).email) {
        const { data: byEmail } = await admin
          .from("profiles")
          .select("id")
          .eq("email", (supaUser as any).email)
          .maybeSingle();
        if (byEmail?.id) internalUserId = byEmail.id;
      }
      // 그래도 없으면 아직 프로필이 없다고 판단
      if (!internalUserId) {
        return res.status(409).json({
          canApply: false,
          error: "프로필 동기화가 필요합니다.",
          requiresSync: true,
        });
      }
    } else if (nextUser) {
      // (B) 카카오 로그인: 이메일 필수
      const email: string | undefined = nextUser.email;
      if (!email) {
        return res.status(401).json({ canApply: false, error: "이메일 권한 동의가 필요합니다." });
      }

      const { data: profile, error: profileErr } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
      if (profileErr) {
        console.error("❌ profiles 조회 에러:", profileErr);
        return res.status(500).json({ canApply: false, error: "프로필 조회 실패" });
      }
      if (!profile?.id) {
        return res.status(409).json({
          canApply: false,
          error: "프로필 동기화가 필요합니다.",
          requiresSync: true,
        });
      }
      internalUserId = profile.id;
    }

    if (!internalUserId) {
      return res.status(401).json({ canApply: false, error: "유효하지 않은 세션" });
    }

    // 4) 진행 중 섭외 존재 여부 (NULL 이거나 'in_progress' 둘 다 차단)
    const { data: existing, error: findError } = await admin
      .from("inquiries")
      .select("id, status")
      .eq("user_id", internalUserId)
      .eq("speaker_id", speakerId)
      .or("status.is.null,status.eq.in_progress") // ← 핵심 추가
      .maybeSingle();

    if (findError) {
      console.error("❌ Supabase 조회 에러:", findError);
      return res.status(500).json({ canApply: false, error: "DB 조회 실패" });
    }

    if (existing) {
      return res.status(403).json({ canApply: false, reason: "이미 진행 중인 섭외가 있습니다." });
    }

    return res.status(200).json({ canApply: true, message: "섭외 가능" });
  } catch (e) {
    console.error("🔥 처리 중 예외 발생:", e);
    return res.status(500).json({ canApply: false, error: "서버 내부 오류" });
  }
}
