// pages/api/inquiry/check_artist.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 🔒 절대 캐시 금지 (권한/상태는 매번 달라질 수 있음)
  res.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "GET") {
    return res.status(405).json({ canApply: false, error: "GET 메소드만 허용됩니다." });
  }

  // 0) 파라미터 체크
  const artistId = req.query.artistId as string | undefined;
  if (!artistId) {
    return res.status(400).json({ canApply: false, error: "유효하지 않은 artistId" });
  }

  // 1) ENV 가드
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ canApply: false, error: "서버 환경변수 누락(Supabase URL/Service role key)" });
  }

  try {
    // 2) 두 체계의 세션 확인 (둘 중 하나만 로그인돼도 OK)
    const supabase = createPagesServerClient({ req, res });
    const { data: { user: supaUser } = { user: null } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } } as any));

    const session = await getServerSession(req, res, authOptions).catch(() => null);
    const nextUser = session?.user as any | undefined;

    if (!supaUser && !nextUser) {
      return res.status(401).json({ canApply: false, error: "로그인이 필요합니다." });
    }

    // 3) 내부 UUID(profiles.id) 확보 (service-role 사용)
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

    let internalUserId: string | null = null;

    if (supaUser?.id) {
      // (A) Supabase 로그인: profiles에서 매핑 (id 또는 이메일 fallback)
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

    // 4) 진행 중 섭외 존재 여부 확인
    //    NULL 또는 'in_progress'를 모두 "진행중"으로 간주하여 차단
    const { data: existing, error: findError } = await admin
      .from("inquiries_artist")
      .select("id, status")
      .eq("user_id", internalUserId)
      .eq("artist_id", artistId)
      .or("status.is.null,status.eq.in_progress")
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
